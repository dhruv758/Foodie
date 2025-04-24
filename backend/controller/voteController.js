// const { Poll } = require("../model/pollModel.js");

// // Updated rate limit handler that informs user + retries
// const handleSlackRateLimit = async (fn, args, slackApp, user_id, channel, context = "action") => {
//   try {
//     return await fn(args);
//   } catch (error) {
//     if (error.data?.error === 'ratelimited' && error.headers?.['retry-after']) {
//       const retryAfter = parseInt(error.headers['retry-after'], 10);
//       console.warn(`⚠️ Slack rate limit hit. Retrying after ${retryAfter} seconds...`);

//       // Send ephemeral message to user
//       if (slackApp && user_id && channel) {
//         await slackApp.client.chat.postEphemeral({
//           token: process.env.SLACK_BOT_TOKEN,
//           channel,
//           user: user_id,
//           text: `⚠️ Slack is temporarily busy. Please retry your ${context} after *${retryAfter} seconds*. 🙏`
//         });
//       }

//       // Wait and retry
//       await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//       return await fn(args);
//     }
//     throw error;
//   }
// };

// exports.handleVote = async (slackApp, user_id, username, choice, poll_id) => {
//   try {
//     if (!user_id) {
//       console.error("Missing user_id in vote request");
//       return false;
//     }

//     const poll = await Poll.findOne({ poll_id });
//     if (!poll) {
//       console.error(`❌ Poll not found with poll_id: ${poll_id}`);
//       return false;
//     }

//     if (poll.status !== 'active') {
//       console.log(`Poll ${poll_id} is ${poll.status}, votes not accepted`);
//       return false;
//     }

//     const optionIndex = poll.options.findIndex(opt => opt.name === choice);
//     if (optionIndex === -1) {
//       console.error(`❌ Option ${choice} not found in poll ${poll_id}`);
//       return false;
//     }

//     const now = new Date();
//     const existingVote = poll.votes.find(v => v.user_id === user_id);

//     let wasUpdated = false;

//     if (existingVote) {
//       const prevChoice = existingVote.choice;

//       if (prevChoice !== choice) {
//         // Change vote
//         await Poll.updateOne(
//           { poll_id, "votes.user_id": user_id },
//           {
//             $set: {
//               "votes.$.choice": choice,
//               "votes.$.timestamp": now
//             },
//             $inc: {
//               "options.$[prev].vote_count": -1,
//               "options.$[new].vote_count": 1
//             }
//           },
//           {
//             arrayFilters: [
//               { "prev.name": prevChoice },
//               { "new.name": choice }
//             ]
//           }
//         );
//         wasUpdated = true;
//       }
//     } else {
//       // First vote
//       await Poll.updateOne(
//         { poll_id },
//         {
//           $push: {
//             votes: {
//               user_id,
//               username,
//               choice,
//               timestamp: now
//             }
//           },
//           $inc: {
//             "options.$[option].vote_count": 1
//           }
//         },
//         {
//           arrayFilters: [{ "option.name": choice }]
//         }
//       );
//     }

//     // Refetch updated poll
//     const updatedPoll = await Poll.findOne({ poll_id });
//     const totalVotes = updatedPoll.votes.length;

//     const blocks = [
//       {
//         type: "section",
//         text: {
//           type: "mrkdwn",
//           text: `🍽️ *${updatedPoll.title}*\n\n*Total Votes:* ${totalVotes}`
//         }
//       },
//       {
//         type: "actions",
//         elements: updatedPoll.options.map(option => ({
//           type: "button",
//           text: {
//             type: "plain_text",
//             text: `${option.name} (${option.vote_count})`
//           },
//           value: `${option.name}_${poll_id}`,
//           action_id: `vote_${option.name}`
//         }))
//       },
//       {
//         type: "actions",
//         elements: [
//           {
//             type: "button",
//             text: {
//               type: "plain_text",
//               text: "📊 View Votes"
//             },
//             value: poll_id,
//             action_id: "view_votes"
//           }
//         ]
//       }
//     ];

//     // Slack: update main message
//     await handleSlackRateLimit(
//       slackApp.client.chat.update,
//       {
//         token: process.env.SLACK_BOT_TOKEN,
//         channel: updatedPoll.channel_id,
//         ts: updatedPoll.message_ts,
//         blocks: blocks
//       },
//       slackApp,
//       user_id,
//       updatedPoll.channel_id,
//       "poll update"
//     );

//     // Delete old ephemeral if exists
//     const previousEphemeralTs = updatedPoll.ephemeral_ts?.[user_id];
//     if (previousEphemeralTs) {
//       await handleSlackRateLimit(
//         slackApp.client.chat.delete,
//         {
//           token: process.env.SLACK_BOT_TOKEN,
//           channel: updatedPoll.channel_id,
//           ts: previousEphemeralTs
//         },
//         slackApp,
//         user_id,
//         updatedPoll.channel_id,
//         "delete previous ephemeral message"
//       );
//     }

//     // Send updated ephemeral message
//     const responseText = wasUpdated
//       ? `🔄 You changed your vote to *${choice}*.`
//       : `✅ You voted for *${choice}*. Thanks for participating! 🎉`;

//     const { message_ts } = await handleSlackRateLimit(
//       slackApp.client.chat.postEphemeral,
//       {
//         token: process.env.SLACK_BOT_TOKEN,
//         channel: updatedPoll.channel_id,
//         user: user_id,
//         text: responseText
//       },
//       slackApp,
//       user_id,
//       updatedPoll.channel_id,
//       "ephemeral vote response"
//     );

//     // Store new ephemeral timestamp
//     await Poll.updateOne(
//       { poll_id },
//       { $set: { [`ephemeral_ts.${user_id}`]: message_ts } }
//     );

//     return true;
//   } catch (error) {
//     console.error("❌ Error handling vote:", error);
//     return false;
//   }
// };
