const { slackApp } = require("../slack/app");
const { Poll } = require("../model/pollModel");
const { v4: uuidv4 } = require("uuid");
const { closePoll } = require("./closePoll");


const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find(); // fetch all polls from DB
    res.status(200).json(polls);
  } catch (error) {
    console.error(":x: Error fetching polls:", error);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
};

async function sendPoll(req, res) {
  try {
    const poll_id = uuidv4();
    const { options, expires_at: expiresAtRaw, title, channel_id } = req.body;

    // Validate and format options
    if (
      !options ||
      !Array.isArray(options) ||
      options.length === 0 ||
      !options.every(opt => opt.name && opt.url)
    ) {
      return res.status(400).json({ error: "Options must include both name and url." });
    }

    // Parse expires_at to Date object
    const expires_at = new Date(expiresAtRaw);
    if (isNaN(expires_at.getTime())) {
      return res.status(400).json({ error: "Invalid expires_at format." });
    }

    const formattedTitle = title || "Food Poll";

    // Build Slack poll blocks
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:knife_fork_plate: *${formattedTitle}*\n\nTotal Votes: 0`
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
              text: ":bar_chart: View Votes"
            },
            value: poll_id,
            action_id: "view_votes"
          }
        ]
      }
    ];

    // Send message to Slack
    const result = await slackApp.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel_id || process.env.SLACK_CHANNEL,
      text: `:knife_fork_plate: *${formattedTitle}* Vote for your favorite!`,
      blocks
    });

    if (!result?.channel || !result?.ts) {
      throw new Error("Failed to send poll to Slack.");
    }

    // Save poll to MongoDB
    await Poll.create({
      poll_id,
      message_ts: result.ts,
      channel_id: result.channel,
      title: formattedTitle,
      options,
      votes: [],
      status: "active",
      created_at: new Date(),
      expires_at
    });

    // Schedule automatic poll close
    const delay = expires_at.getTime() - Date.now();
    setTimeout(() => closePoll(result.channel, result.ts, poll_id), delay);

    res.status(200).json({ message: "Poll sent successfully!", poll_id });

  } catch (error) {
    console.error(":x: Error sending poll:", error);
    res.status(500).json({ error: "Error sending poll" });
  }
}

module.exports = { sendPoll, getAllPolls, };