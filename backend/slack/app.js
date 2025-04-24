// require('dotenv').config();
// const { App } = require("@slack/bolt");
// const { WebClient } = require("@slack/web-api");
// const { handleVote} = require("../controller/voteController");
// const { Poll } = require("../model/pollModel");

// const slackApp = new App({
//   token: process.env.SLACK_BOT_TOKEN,
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
//   appToken: process.env.SLACK_APP_TOKEN,
//   socketMode: true,
//   pingInterval: 15000,
// });

// const web = new WebClient(process.env.SLACK_BOT_TOKEN);

// async function startSlackApp() {
//     try {
//       await slackApp.start();  
//       console.log("🚀 Slack bot is running in Socket Mode!");

//       await getAllChannels(); 
//     } catch (error) {
//       console.error("❌ Error starting Slack app:", error);
//       process.exit(1);
//     }
// }
// // startSlackApp();
// module.exports = { slackApp, startSlackApp };

// function validateVotePayload(body) {
//   const userId = body?.user?.id;
//   const actionValue = body?.actions?.[0]?.value;
//   if (!actionValue) {
//     console.error("❌ actionValue is undefined!");
//     return;
//   }
//   // console.log("✅ Extracted Action Value:", actionValue);
//   if (!userId || !actionValue) return { valid: false };
  
//   const lastUnderscore = actionValue.lastIndexOf("_");
//   if (lastUnderscore === -1) return { valid: false };

//   return {
//     valid: true,
//     userId,
//     actionValue,
//     choice: actionValue.substring(0, lastUnderscore),
//     poll_id: actionValue.substring(lastUnderscore + 1),
//     username: body.user.username || body.user.name || `user-${userId}`
//   };
// }
// slackApp.action(/vote_.*/, async ({ ack, body }) => {
//     try {
//       await ack();
//       const { valid, userId, username, choice, poll_id } = validateVotePayload(body);

//       if (!valid) return console.error("❌ Invalid vote payload");
      
//       console.log(`🔹 Processing vote: ${username} (${userId}) voted for ${choice} in poll ${poll_id}`);

//       await handleVote(slackApp, userId, username, choice, poll_id);
//     } catch (error) {
//       console.error("❌ Error processing vote action:", error);
//     }
// });
// async function getAllChannels() {
//     try {
//       const result = await web.conversations.list({ types: "public_channel,private_channel" });
//       const channels = result.channels.map(channel => ({ id: channel.id, name: channel.name }));
//       console.log("✅ Channels in the workspace:", channels);
//     } catch (error) {
//       console.error("❌ Error fetching channels:", error);
//     }
// }

// const LOADING_VIEW = {
//   type: "modal",
//   title: {
//     type: "plain_text",
//     text: "Poll Results"
//   },
//   close: {
//     type: "plain_text",
//     text: "Close"
//   },
//   blocks: [
//     {
//       type: "section",
//       text: {
//         type: "plain_text",
//         text: "Loading vote details..."
//       }
//     }
//   ]
// };

// slackApp.action("view_votes", async ({ ack, body, client }) => {
//   await ack();
  
//   try {
//     const poll_id = body.actions[0]?.value;
//     if (!poll_id) return;
    
//     const modalResponse = await client.views.open({
//       trigger_id: body.trigger_id,
//       view: LOADING_VIEW
//     });
    
//     const poll = await Poll.findOne({ poll_id });
//     if (!poll) throw new Error(`Poll not found: ${poll_id}`);
    
//     await client.views.update({
//       view_id: modalResponse.view.id,
//       view: {
//         type: "modal",
//         title: {
//           type: "plain_text",
//           text: "Poll Results"
//         },
//         close: {
//           type: "plain_text",
//           text: "Close"
//         },
//         blocks: generateVoteBlocks(poll)
//       }
//     });
//   } catch (error) {
//     console.error("Error in view_votes:", error.message);
//     // Send fallback error message only if we can identify the user and channel
//     if (body.user?.id && (body.channel?.id || body.channel_id)) {
//       await client.chat.postEphemeral({
//         channel: body.channel?.id || body.channel_id,
//         user: body.user?.id,
//         text: "Could not display vote details. Please try again."
//       });
//     }
//   }
// });

// function generateVoteBlocks(poll) {
//   const blocks = [
//     {
//       type: "header",
//       text: {
//         type: "plain_text",
//         text: `📊 Results`,
//         emoji: true
//       }
//     },
//     { type: "divider" }
//   ];

//   for (const option of poll.options) {
//     const votersForOption = poll.votes
//       .filter(vote => vote.choice === option.name)
//       .map(vote => `• <@${vote.user_id}>`);

//     blocks.push({
//       type: "section",
//       text: {
//         type: "mrkdwn",
//         text: `*${option.name}* — *${option.vote_count} votes*\n${
//           votersForOption.length > 0 ? votersForOption.join('\n') : '_No votes yet_'
//         }`
//       }
//     });
//     blocks.push({ type: "divider" });
//   }

//   return blocks;
// }
