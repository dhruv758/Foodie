const { slackApp } = require("../slack/app");
const { Poll } = require("../model/pollModel");
const { v4: uuidv4 } = require("uuid");
const { closePoll } = require("./closePoll");
const ScheduledPoll = require("../model/poll_model");


const getPollSummary = async (req, res) => {
  try {
    const poll = await ScheduledPoll.findById(req.params.pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    const summary = {
      title: poll.question,
      options: poll.options.map((opt) => ({
        name: opt.name,
        url: opt.url,
        vote_count: opt.vote_count,
      })),
    };

    res.json(summary);
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};


const getAllPolls = async (req, res) => {
  try {
    const polls = await ScheduledPoll.find().sort({created_at:-1}); // fetch all polls from DB
    // console.log(polls)
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

// Updated getVotersByDish function to use findById instead of findOne({ poll_id })
const getVotersByDish = async (req, res) => {
  try {
    const { pollId } = req.params;

    if (!pollId) {
      return res.status(400).json({ error: "Poll ID is required" });
    }

    // Changed from findOne({poll_id: pollId}) to findById(pollId)
    const poll = await ScheduledPoll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const votersByDish = {};
    poll.options.forEach(option => {
      votersByDish[option.name] = {
        id: option.name,
        name: option.name,
        users: []
      };
    });

    poll.votes.forEach(vote => {
      if (votersByDish[vote.choice]) {
        votersByDish[vote.choice].users.push({
          user_id: vote.user_id,
          username: vote.username,
          timestamp: vote.timestamp
        });
      }
    });

    res.status(200).json(Object.values(votersByDish));
  } catch (error) {
    console.error("Error getting voters by dish:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { sendPoll, getAllPolls, getPollSummary, getVotersByDish };