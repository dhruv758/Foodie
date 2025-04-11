const { slackApp } = require("../slack/app");
const { Poll } = require("../model/pollModel");
const { v4: uuidv4 } = require("uuid");
const { closePoll } = require("./closePoll");

async function sendPoll(req, res) {
  try {
    const poll_id = uuidv4();

    const { options, expires_at } = req.body;

    // const options = req.body.options || [
    //   { name: "Pizza", url: "https://example.com/images/pizza.jpg", vote_count: 0, voters: [] },
    //   { name: "Sushi", url: "https://example.com/images/sushi.jpg", vote_count: 0, voters: [] },
    //   { name: "Burger", url: "https://example.com/images/burger.jpg", vote_count: 0, voters: [] }
    // ];
    
    // // Ensure all options have vote_count and voters array initialized
    // options.forEach(option => {
    //   option.vote_count = 0;
    //   option.voters = [];
    // });

    const title = req.body.title || "Food Poll";
    // const expires_at = req.body.expires_at ? new Date(req.body.expires_at) : new Date(Date.now() + 5 * 60 * 1000); 

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
      text: `🍽️ *${title}* Vote for your favorite!`,
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

    const delay = expires_at.getTime() - Date.now();
    setTimeout(() => closePoll(result.channel, result.ts, poll_id), delay);

    res.status(200).json({ message: "Poll sent successfully!", poll_id });
  } catch (error) {
    console.error("❌ Error sending poll:", error);
    res.status(500).json({ error: "Error sending poll" });
  }
}

module.exports = {sendPoll};
