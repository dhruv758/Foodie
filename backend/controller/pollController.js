// const { slackApp } = require("../slack/app");
// const { Poll } = require("../model/pollModel");
// const { getVoteCounts } = require("./voteController");
// const { v4: uuidv4 } = require("uuid");

// async function sendPoll(req, res) {
//   try {
//     const poll_id = uuidv4();
//     // const { options, expires_at } = req.body;
//     const options = [
//       { name: "Pizza", url: "https://example.com/images/pizza.jpg" },
//       { name: "Sushi", url: "https://example.com/images/sushi.jpg" },
//       { name: "Burger", url: "https://example.com/images/burger.jpg" }
//     ];

//     // ✅ Expires in 5 minutes
//     const expires_at = new Date(Date.now() + 5 * 60 * 1000);

//     // Validation
//     if (
//       !options ||
//       !Array.isArray(options) ||
//       options.length === 0 ||
//       !options.every(opt => opt.name && opt.url)
//     ) {
//       return res.status(400).json({ error: "Options must include both name and url." });
//     }
//     const blocks = [
//       {
//         type: "section",
//         text: {
//           type: "mrkdwn",
//           text: `🍽️ *Food Poll!* What do you want to eat?\n\nTotal Votes: 0`
//         }
//       },
//       {
//         type: "actions",
//         elements: options.map((opt) => ({
//           type: "button",
//           text: {
//             type: "plain_text",
//             text: `${opt.name} (0)`
//           },
//           value: `${opt.name}_${poll_id}`,
//           action_id: `vote_${opt.name}`
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

//     const result = await slackApp.client.chat.postMessage({
//       token: process.env.SLACK_BOT_TOKEN,
//       channel: process.env.SLACK_CHANNEL,
//       text: "🍽️ *Food Poll!* Vote for your favorite food!",
//       blocks
//     });

//     if (!result?.channel || !result?.ts) {
//       throw new Error("Failed to send poll to Slack.");
//     }

//     await Poll.create({
//       poll_id,
//       message_ts: result.ts,
//       channel_id: result.channel,
//       title: "Food Poll",
//       options, 
//       status: 'active',
//       created_at: new Date(),
//       expires_at: new Date(expires_at)
//     });
//     const delay = new Date(expires_at).getTime() - Date.now();
//     setTimeout(() => closePoll(result.channel, result.ts, poll_id), delay);

//     res.status(200).json({ message: "Poll sent successfully!", poll_id });
//   } catch (error) {
//     console.error("❌ Error sending poll:", error);
//     res.status(500).json({ error: "Error sending poll" });
//   }
// }

// async function closePoll(channelId, messageTs, poll_id) {
//   try {
//     const voteCounts = await getVoteCounts(poll_id);

//     const resultText = Object.entries(voteCounts)
//       .map(([option, count]) => `${option.replace(/_/g, ' ')}: ${count}`)
//       .join("\n");

//     const finalText = `🚫 *Poll Closed!* Voting is no longer available.\n\n${resultText}`;

//     await slackApp.client.chat.update({
//       token: process.env.SLACK_BOT_TOKEN,
//       channel: channelId,
//       ts: messageTs,
//       text: finalText
//     });

//     await Poll.findOneAndUpdate(
//       { poll_id },
//       { status: 'closed' }
//     );

//     console.log("✅ Poll closed successfully.");
//   } catch (error) {
//     console.error("❌ Error closing poll:", error);
//   }
// }

// async function getPollById(poll_id) {
//   try {
//     return await Poll.findOne({ poll_id });
//   } catch (error) {
//     console.error(`❌ Error finding poll ${poll_id}:`, error);
//     return null;
//   }
// }

// module.exports = {sendPoll,closePoll,getPollById};


const { slackApp } = require("../slack/app");
const { Poll } = require("../model/pollModel");
const { v4: uuidv4 } = require("uuid");

// Send a new poll
async function sendPoll(req, res) {
  try {
    const poll_id = uuidv4();

    // Sample options - replace this with req.body.options and req.body.expires_at if coming from frontend
    const options = [
      { name: "Pizza", url: "https://example.com/images/pizza.jpg" },
      { name: "Sushi", url: "https://example.com/images/sushi.jpg" },
      { name: "Burger", url: "https://example.com/images/burger.jpg" }
    ];

    const expires_at = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

    if (
      !options ||
      !Array.isArray(options) ||
      options.length === 0 ||
      !options.every(opt => opt.name && opt.url)
    ) {
      return res.status(400).json({ error: "Options must include both name and url." });
    }

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🍽️ *Food Poll!* What do you want to eat?\n\nTotal Votes: 0`
        }
      },
      {
        type: "actions",
        elements: options.map((opt) => ({
          type: "button",
          text: {
            type: "plain_text",
            text: `${opt.name} (0)`
          },
          value: `${opt.name}_${poll_id}`,
          action_id: `vote_${opt.name}`
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

    const result = await slackApp.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.SLACK_CHANNEL,
      text: "🍽️ *Food Poll!* Vote for your favorite food!",
      blocks
    });

    if (!result?.channel || !result?.ts) {
      throw new Error("Failed to send poll to Slack.");
    }

    // Prepare initial vote summary
    const vote_summary = {};
    options.forEach(opt => {
      vote_summary[opt.name] = 0;
    });

    await Poll.create({
      poll_id,
      message_ts: result.ts,
      channel_id: result.channel,
      title: "Food Poll",
      options,
      votes: [],
      vote_summary,
      status: "active",
      created_at: new Date(),
      expires_at: expires_at
    });

    // Auto close poll after expiry
    const delay = expires_at.getTime() - Date.now();
    setTimeout(() => closePoll(result.channel, result.ts, poll_id), delay);

    res.status(200).json({ message: "Poll sent successfully!", poll_id });
  } catch (error) {
    console.error("❌ Error sending poll:", error);
    res.status(500).json({ error: "Error sending poll" });
  }
}

// Close a poll
async function closePoll(channelId, messageTs, poll_id) {
  try {
    const poll = await Poll.findOne({ poll_id });
    if (!poll) {
      console.error(`Poll not found: ${poll_id}`);
      return;
    }

    const summary = poll.vote_summary;
    const resultText = Object.entries(summary)
      .map(([option, count]) => `${option}: ${count}`)
      .join("\n");

    const finalText = `🚫 *Poll Closed!* Voting is no longer available.\n\n${resultText}`;

    await slackApp.client.chat.update({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channelId,
      ts: messageTs,
      text: finalText
    });

    await Poll.findOneAndUpdate(
      { poll_id },
      { status: "closed" }
    );

    console.log("✅ Poll closed successfully.");
  } catch (error) {
    console.error("❌ Error closing poll:", error);
  }
}

// Get poll details
async function getPollById(poll_id) {
  try {
    return await Poll.findOne({ poll_id });
  } catch (error) {
    console.error(`❌ Error finding poll ${poll_id}:`, error);
    return null;
  }
}

module.exports = { sendPoll, closePoll, getPollById };
