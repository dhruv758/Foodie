const axios = require("axios");
const ScheduledPoll = require("../model/poll_model"); // import model to save ts and channel

const sendPollToSlack = async (poll) => {
  try {
    const token = process.env.SLACK_BOT_TOKEN;
    const channel = process.env.SLACK_CHANNEL;

    if (!token) {
      throw new Error("SLACK_BOT_TOKEN is not set in environment variables.");
    }

    if (poll.notifyOnly) {
      const totalVotes = poll.totalVotes || 0;
      const topOption = poll.options.reduce((a, b) =>
        (a.vote_count || 0) > (b.vote_count || 0) ? a : b
      );
      const resultBreakdown = poll.options
        .map((opt) => `• *${opt.name}* — ${opt.vote_count || 0} votes`)
        .join("\n");

      const payload = {
        channel,
        text: `<!channel> 🔒 *Poll "${poll.question}" has closed!*`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "📢 Poll Closed!",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `🔒 *${poll.question}* has now closed.\n\n🥇 *Top Choice:* ${topOption.name}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `📊 *Final Results:*\n${resultBreakdown}`,
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `✅ *Total Votes:* ${totalVotes}`,
              },
            ],
          },
        ],
      };

      await axios.post("https://slack.com/api/chat.postMessage", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📢 Poll closure notification sent to Slack via Bot API.");
      return;
    }

    // 📊 Initial Poll Posting (new polls)
    const optionBlocks = poll.options.map((option, index) => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${option.name}* (${option.vote_count || 0} votes)`,
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Vote",
          emoji: true,
        },
        value: JSON.stringify({
          pollId: poll._id,
          choice: option.name,
          index,
        }),
        action_id: `vote_${index}`,
      },
    }));

    const footerBlock = {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "📊 View Responses",
          },
          value: JSON.stringify({ pollId: poll._id }),
          action_id: "view_votes",
        },
      ],
    };

    const payload = {
      channel,
      text: `Poll: ${poll.question}`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<!channel> 📊 *${poll.question}*`,
          },
        },
        ...optionBlocks,
        footerBlock,
      ],
    };

    const response = await axios.post("https://slack.com/api/chat.postMessage", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.ok) {
      console.log("✅ Poll sent to Slack successfully.");

      const { ts, channel } = response.data;

      // 🔥 Save ts and channel to database for future deletion
      await ScheduledPoll.findByIdAndUpdate(poll._id, {
        slackTs: ts,
        slackChannel: channel,
      });

      console.log("📌 Saved Slack message ts and channel to Poll DB.");
    } else {
      console.error("❌ Slack API error:", response.data.error);
    }

  } catch (error) {
    console.error("❌ Error sending poll to Slack:", error.response?.data || error.message);
  }
};

module.exports = { sendPollToSlack };
