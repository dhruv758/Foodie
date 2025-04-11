require('dotenv').config();
const { App } = require("@slack/bolt");
const { WebClient } = require("@slack/web-api");  
const {Vote} = require("../model/voteModel")
const { handleVote, viewVoteDetails } = require("../controller/voteController");

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
      
      const [poll_id] = actionValue.match(/[a-f0-9\-]{36}$/) || [];
      if (!poll_id) {
        console.error("❌ Could not extract poll_id from action value:", actionValue);
        return;
      }
      
      const choice = actionValue.replace(`_${poll_id}`, "");
      

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
    await ack(); // Acknowledge the action

    try {
        const poll_id = body.actions[0].value; // Extract poll_id from button value
    
        const votes = await Vote.find({ poll_id });
        if (!votes.length) {
            await client.chat.postEphemeral({
                token: process.env.SLACK_BOT_TOKEN,
                channel: body.channel.id,
                user: body.user.id,
                text: "No votes have been cast yet!"
            });
            return;
        }

        // Format votes as a message
        const voteSummary = votes.map(vote => `*${vote.username}* voted for *${vote.choice}*`).join("\n");

        await client.chat.postEphemeral({
            token: process.env.SLACK_BOT_TOKEN,
            channel: body.channel.id,
            user: body.user.id,
            text: `📊 *Current Votes:*\n${voteSummary}`
        });

    } catch (error) {
        console.error("Error handling view_votes action:", error);
    }
});

module.exports = { slackApp };
