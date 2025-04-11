require('dotenv').config();
const { App } = require("@slack/bolt");
const { WebClient } = require("@slack/web-api");
const { handleVote} = require("../controller/voteController");
const {viewVoteDetails} = require("../controller/viewVotedetails");

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  pingInterval: 15000,
});

const web = new WebClient(process.env.SLACK_BOT_TOKEN);

async function startSlackApp() {
    try {
      await slackApp.start();  
      console.log("🚀 Slack bot is running in Socket Mode!");

      await getAllChannels(); 
    } catch (error) {
      console.error("❌ Error starting Slack app:", error);
      process.exit(1);
    }
}
startSlackApp();

slackApp.action(/vote_.*/, async ({ ack, body }) => {
    try {
      await ack();
      console.log("🔹 User data:", body.user);

      if (!body.user || !body.user.id) {
        console.error("❌ Missing user information in payload");
        return;
      }
      
      const actionValue = body?.actions?.[0]?.value;
      if (!actionValue) {
        console.error("❌ actionValue is undefined!");
        return;
      }
      
      console.log("✅ Extracted Action Value:", actionValue);
      
      const lastUnderscoreIndex = actionValue.lastIndexOf("_");
      if (lastUnderscoreIndex === -1) {
        console.error("❌ Invalid action value format:", actionValue);
        return;
      }
      
      const choice = actionValue.substring(0, lastUnderscoreIndex);
      const poll_id = actionValue.substring(lastUnderscoreIndex + 1);
      const username = body.user.username || body.user.name || `user-${body.user.id}`;
      
      console.log(`🔹 Processing vote: ${username} (${body.user.id}) voted for ${choice} in poll ${poll_id}`);
      
      await handleVote(slackApp, body.user.id, username, choice, poll_id);
    } catch (error) {
      console.error("❌ Error processing vote action:", error);
    }
});

async function getAllChannels() {
    try {
      const result = await web.conversations.list({ types: "public_channel,private_channel" });
      const channels = result.channels.map(channel => ({ id: channel.id, name: channel.name }));
      console.log("✅ Channels in the workspace:", channels);
    } catch (error) {
      console.error("❌ Error fetching channels:", error);
    }
}
slackApp.action("view_votes", async ({ ack, body, client }) => {
  await ack();

  try {
    console.log("📩 Action Body:", JSON.stringify(body, null, 2));

    const poll_id = body.actions[0]?.value;
    if (!poll_id) throw new Error("Missing poll_id from button value");

    const voteDetailsBlocks = await viewVoteDetails(poll_id);

    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        title: {
          type: "plain_text",
          text: "Poll Results"
        },
        blocks: voteDetailsBlocks,
        close: {
          type: "plain_text",
          text: "Close"
        }
      }
    });
  } catch (error) {
    console.error("❌ Error handling view_votes action:", error);

    try {
      await client.chat.postEphemeral({
        token: process.env.SLACK_BOT_TOKEN,
        channel: body.channel.id,
        user: body.user.id,
        text: "Could not display vote details. Please try again."
      });
    } catch (ephemeralErr) {
      console.error("⚠️ Failed to send fallback message:", ephemeralErr);
    }
  }
});

module.exports = { slackApp };
