const { slackApp } = require("../slack/app");
const { Poll } = require("../model/pollModel");
const { getVoteCounts } = require("./voteController");
const { v4: uuidv4 } = require("uuid");

async function sendPoll(req, res) {
  try {
    const poll_id = uuidv4();
    // const { options, expires_at } = req.body;
    // Validation
    const options = [
      { name: "Pizza", url: "https://example.com/images/pizza.jpg" },
      { name: "Sushi", url: "https://example.com/images/sushi.jpg" },
      { name: "Burger", url: "https://example.com/images/burger.jpg" }
     ];
     // :white_check_mark: Expires in 5 minutes
     const expires_at = new Date(Date.now() + 5 * 60 * 1000);
     
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

    await Poll.create({
      poll_id,
      message_ts: result.ts,
      channel_id: result.channel,
      title: "Food Poll",
      options, 
      status: 'active',
      created_at: new Date(),
      expires_at: new Date(expires_at)
    });
    const delay = new Date(expires_at).getTime() - Date.now();
    setTimeout(() => closePoll(result.channel, result.ts, poll_id), delay);

    res.status(200).json({ message: "Poll sent successfully!", poll_id });
  } catch (error) {
    console.error("❌ Error sending poll:", error);
    res.status(500).json({ error: "Error sending poll" });
  }
}

async function closePoll(channelId, messageTs, poll_id) {
  try {
    const voteCounts = await getVoteCounts(poll_id);

    const resultText = Object.entries(voteCounts)
      .map(([option, count]) => `${option.replace(/_/g, ' ')}: ${count}`)
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
      { status: 'closed' }
    );

    console.log("✅ Poll closed successfully.");
  } catch (error) {
    console.error("❌ Error closing poll:", error);
  }
}

async function getPollById(poll_id) {
  try {
    return await Poll.findOne({ poll_id });
  } catch (error) {
    console.error(`❌ Error finding poll ${poll_id}:`, error);
    return null;
  }
}


const getAllPollsController = async (req, res) => {
  try {
    
    const polls = await Poll.find({}).sort({ createdAt: -1 }) // Sort in descending order (latest first)
    .limit(10);
    
    return res.status(200).json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    
    // Return an error message with a 500 Internal Server Error status
    return res.status(500).json({ message: "Error fetching polls", error });
  }
};


module.exports = {sendPoll,closePoll,getPollById , getAllPollsController};
