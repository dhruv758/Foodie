const { slackApp } = require("../slack/app");
const { Poll } = require("../model/pollModel");
const { v4: uuidv4 } = require("uuid");
const { closePoll } = require("./closePoll");

function formatTime(date) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  }).format(date);
}

async function sendPoll(req, res) {
  try {
    const poll_id = uuidv4();

    const options = req.body.options || [
      { name: "Pizza", url: "https://example.com/images/pizza.jpg", vote_count: 0, voters: [] },
      { name: "Sushi", url: "https://example.com/images/sushi.jpg", vote_count: 0, voters: [] },
      { name: "Burger", url: "https://example.com/images/burger.jpg", vote_count: 0, voters: [] }
    ];
    
    // Ensure all options have vote_count and voters array initialized
    options.forEach(option => {
      option.vote_count = 0;
    });

    const title = req.body.title || "Food Poll";
    const durationMinutes = parseInt(req.body.expires_at, 10) || 5;
    const now = new Date();
    const expires_at = new Date(now.getTime() + durationMinutes * 60 * 1000);

    const formattedTime = formatTime(expires_at);
    const textMessage = `<!channel> 🍽️ *${title}* Vote for your favorite!\n_Poll will close at *${formattedTime}*_`;


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
          text: `🍽️ *${title}*\n\nTotal Votes: 0`
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
      channel: req.body.channel_id || process.env.SLACK_CHANNEL,
      text: textMessage,
      blocks
    });

    if (!result?.channel || !result?.ts) {
      throw new Error("Failed to send poll to Slack.");
    }

    await Poll.create({
      poll_id,
      message_ts: result.ts,
      channel_id: result.channel,
      title: title,
      options,
      votes: [],
      status: "active",
      created_at: new Date(),
      expires_at: expires_at
    });

    const delay = expires_at.getTime() - now.getTime();
    setTimeout(() => closePoll(result.channel, result.ts, poll_id), delay);
    res.status(200).json({ message: "Poll sent successfully!", poll_id });

    const reminder = 15 * 60 * 1000;
    const reminderDelay = delay - reminder;

    if (reminderDelay > 0) {
      setTimeout(async () => {
        await slackApp.client.chat.postMessage({
          token: process.env.SLACK_BOT_TOKEN,
          channel: result.channel,
          text: `<!channel> 🕒 Only 15 minutes left, kindly do vote!`
        });
      }, reminderDelay);
    }
  } catch (error) {
    console.error("❌ Error sending poll:", error);
    res.status(500).json({ error: "Error sending poll" });
  }
}

const getAllPollsController = async (req, res) => {
  try {
    console.log("gjhvjh")
    const polls = await Poll.find({})
    
    return res.status(200).json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    
    // Return an error message with a 500 Internal Server Error status
    return res.status(500).json({ message: "Error fetching polls", error });
  }
};

module.exports = {sendPoll ,getAllPollsController};
