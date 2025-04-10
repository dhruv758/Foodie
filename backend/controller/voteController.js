// const { Poll } = require("../model/pollModel");
// const { Vote } = require("../model/voteModel");

// exports.handleVote = async (slackApp, user_id, username, choice, poll_id) => {
//   try {
//     if (!user_id) {
//       console.error("Missing user_id in vote request");
//       return false;
//     }

//     console.log(`Saving vote: ${username} (${user_id}) voted for ${choice} in poll ${poll_id}`);

//     const poll_status= await Poll.findOne({ poll_id });
//     if (!poll_status) {
//       console.error(`❌ Poll not found with poll_id: ${poll_id}`);
//       return false;
//     }
    
//     // Check if poll is still active
//     if (poll_status.status !== 'active') {
//       console.log(`Poll ${poll_id} is ${poll.status}, votes not accepted`);
//       return false;
//     }

//     const poll = await Poll.findOne({ poll_id });
//     if (!poll) {
//       console.error(`❌ Poll not found with poll_id: ${poll_id}`);
//       return false;
//     }
//     await Vote.findOneAndUpdate(
//       { poll_id, user_id },
//       { username, choice, timestamp: new Date() },
//       { upsert: true, new: true }
//     );
//     // Get updated vote counts
//     const voteCounts = await exports.getVoteCounts(poll_id);
//     const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);

//     // Extract only option names not the url ;)
//     const optionNames = poll.options.map(option => option.name);

//     // Update the Slack message with new counts
//     const blocks = [
//       {
//         type: "section",
//         text: {
//           type: "mrkdwn",
//           text: `🍽️ *Food Poll! What do you want to eat?*\n\n*Total Votes:* ${totalVotes}`
//         }
//       },
//       {
//         type: "actions",
//         elements: optionNames.map(option => ({
//           type: "button",
//           text: {
//             type: "plain_text",
//             text: `${option.replace('_', ' ')} (${voteCounts[option] || 0})`
//           },
//           value: `${option}_${poll_id}`,
//           action_id: `vote_${option}`
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

//     await slackApp.client.chat.update({
//       token: process.env.SLACK_BOT_TOKEN,
//       channel: poll.channel_id,
//       ts: poll.message_ts,
//       blocks: blocks
//     });

//     console.log("✅ Vote successfully recorded and poll updated in Slack.");
//     return true;
//   } catch (error) {
//     console.error("❌ Error handling vote:", error);
//     return false;
//   }
// };

// exports.viewVoteDetails = async (poll_id) => {
//   try {
//     const result = await Poll.aggregate([
//       { $match: { poll_id } },
//       { $unwind: "$votes" },
//       {
//         $group: {
//           _id: "$votes.choice",
//           users: { $push: "$votes.username" },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const blocks = [
//       {
//         type: "section",
//         text: {
//           type: "mrkdwn",
//           text: "*Vote Details*"
//         }
//       }
//     ];

//     result.forEach(({ _id: choice, users, count }) => {
//       blocks.push({
//         type: "section",
//         text: {
//           type: "mrkdwn",
//           text: `*${choice.replace('_', ' ')}* (${count})\n${users.join(', ')}`
//         }
//       });
//     });

//     return blocks;
//   } catch (error) {
//     console.error("❌ Error viewing vote details:", error);
//     return [
//       {
//         type: "section",
//         text: { type: "mrkdwn", text: "Error loading vote details" }
//       }
//     ];
//   }
// };


// exports.getVoteCounts = async (poll_id) => {
//   try {
//     const poll = await Poll.aggregate([
//       { $match: { poll_id } },
//       { $unwind: "$votes" },
//       {
//         $group: {
//           _id: "$votes.choice",
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const pollDoc = await Poll.findOne({ poll_id });
//     const voteCounts = {};

//     // Initialize counts to 0
//     pollDoc.options.forEach(option => {
//       voteCounts[option.name] = 0;
//     });

//     // Fill in actual vote counts
//     poll.forEach(({ _id, count }) => {
//       voteCounts[_id] = count;
//     });

//     return voteCounts;
//   } catch (error) {
//     console.error(`Error getting vote counts for poll ${poll_id}:`, error);
//     return {};
//   }
// };

const { Poll } = require("../model/pollModel");

exports.handleVote = async (slackApp, user_id, username, choice, poll_id) => {
  try {
    if (!user_id) {
      console.error("Missing user_id in vote request");
      return false;
    }

    console.log(`Saving vote: ${username} (${user_id}) voted for ${choice} in poll ${poll_id}`);

    const poll_status = await Poll.findOne({ poll_id });
    if (!poll_status) {
      console.error(`❌ Poll not found with poll_id: ${poll_id}`);
      return false;
    }
    
    // Check if poll is still active
    if (poll_status.status !== 'active') {
      console.log(`Poll ${poll_id} is ${poll_status.status}, votes not accepted`);
      return false;
    }

    // Check if the user has already voted and update their vote
    const existingVote = poll_status.votes.find(vote => vote.user_id === user_id);
    if (existingVote) {
      // Update the user's existing vote (removing the old vote and adding the new one)
      existingVote.choice = choice;
      existingVote.timestamp = new Date();
    } else {
      // If the user hasn't voted, add their vote
      poll_status.votes.push({ user_id, username, choice, timestamp: new Date() });
    }

    // Save the updated poll with the new vote
    await poll_status.save();

    // Get updated vote counts
    const voteCounts = await exports.getVoteCounts(poll_id);
    const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);

    // Extract only option names (not the URL)
    const optionNames = poll_status.options.map(option => option.name);

    // Update the Slack message with new counts
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🍽️ *Food Poll! What do you want to eat?*\n\n*Total Votes:* ${totalVotes}`
        }
      },
      {
        type: "actions",
        elements: optionNames.map(option => ({
          type: "button",
          text: {
            type: "plain_text",
            text: `${option.replace('_', ' ')} (${voteCounts[option] || 0})`
          },
          value: `${option}_${poll_id}`,
          action_id: `vote_${option}`
        }))
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "📊 View Votes"
            },
            value: poll_id,
            action_id: "view_votes"
          }
        ]
      }
    ];

    await slackApp.client.chat.update({
      token: process.env.SLACK_BOT_TOKEN,
      channel: poll_status.channel_id,
      ts: poll_status.message_ts,
      blocks: blocks
    });

    console.log("✅ Vote successfully recorded and poll updated in Slack.");
    return true;
  } catch (error) {
    console.error("❌ Error handling vote:", error);
    return false;
  }
};

exports.viewVoteDetails = async (poll_id) => {
  try {
    const result = await Poll.aggregate([
      { $match: { poll_id } },
      { $unwind: "$votes" },
      {
        $group: {
          _id: "$votes.choice",
          users: { $push: "$votes.username" },
          count: { $sum: 1 }
        }
      }
    ]);

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Vote Details*"
        }
      }
    ];

    result.forEach(({ _id: choice, users, count }) => {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${choice.replace('_', ' ')}* (${count})\n${users.join(', ')}`
        }
      });
    });

    return blocks;
  } catch (error) {
    console.error("❌ Error viewing vote details:", error);
    return [
      {
        type: "section",
        text: { type: "mrkdwn", text: "Error loading vote details" }
      }
    ];
  }
};

exports.getVoteCounts = async (poll_id) => {
  try {
    const poll = await Poll.aggregate([
      { $match: { poll_id } },
      { $unwind: "$votes" },
      {
        $group: {
          _id: "$votes.choice",
          count: { $sum: 1 }
        }
      }
    ]);

    const pollDoc = await Poll.findOne({ poll_id });
    const voteCounts = {};

    // Initialize counts to 0
    pollDoc.options.forEach(option => {
      voteCounts[option.name] = 0;
    });

    // Fill in actual vote counts
    poll.forEach(({ _id, count }) => {
      voteCounts[_id] = count;
    });

    return voteCounts;
  } catch (error) {
    console.error(`Error getting vote counts for poll ${poll_id}:`, error);
    return {};
  }
};
