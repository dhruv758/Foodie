// const { Poll } = require('../model/pollModel');
// const { slackApp } = require('../slack/app'); 

// async function closePoll(channelId, messageTs, poll_id) {
//   try {
//     const poll = await Poll.findOne({ poll_id });
//     if (!poll) {
//       console.error(`Poll not found: ${poll_id}`);
//       return;
//     }
//     if (poll.status === "closed") return;

//     // Send a new message to notify poll closure
//     await slackApp.client.chat.postMessage({
//       token: process.env.SLACK_BOT_TOKEN,
//       channel: channelId,
//       text: `🚫 *Poll Closed!* Voting is no longer available.\nContact Mahima if you missed the poll.`
//     });

//     await Poll.findOneAndUpdate(
//       { poll_id },
//       { status: "closed" }
//     );

//     console.log("✅ Poll closed successfully.");
//   } catch (error) {
//     console.error("❌ Error closing poll:", error);
//   }
// }

// module.exports = {closePoll};
