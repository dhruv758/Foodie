const axios = require("axios");

const sendPollToSlack = async (poll) => {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    const token = process.env.SLACK_BOT_TOKEN;
    const channel = process.env.SLACK_CHANNEL;

    if (!webhookUrl) {
      throw new Error("SLACK_WEBHOOK_URL is not set in environment variables.");
    }

    // 🔕 Poll Closure Notification with real Slack notification
    if (poll.notifyOnly) {
      const totalVotes = poll.totalVotes || 0;

      const topOption = poll.options.reduce((a, b) =>
        (a.vote_count || 0) > (b.vote_count || 0) ? a : b
      );

      const resultBreakdown = poll.options
        .map(
          (opt) =>
            `• *${opt.name}* — ${opt.vote_count || 0} vote${opt.vote_count !== 1 ? "s" : ""}`
        )
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

      console.log("📢 Poll closure notification sent to Slack with push.");
      return;
    }

    // 📊 Initial Poll Posting (via webhook)
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

    await axios.post(webhookUrl, payload);
    console.log("✅ Sent interactive poll to Slack via webhook.");
  } catch (error) {
    console.error("❌ Error sending poll to Slack:", error.response?.data || error.message);
  }
};

module.exports = { sendPollToSlack };
