const axios = require("axios");

const sendPollToSlack = async (poll) => {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      throw new Error("SLACK_WEBHOOK_URL is not set in environment variables.");
    }

    // 🔕 Closure Notification
    if (poll.notifyOnly) {
      const payload = {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `🔕 The poll *"${poll.question}"* has now closed.`,
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `✅ *Total votes:* ${poll.totalVotes || 0}`,
              },
            ],
          },
        ],
      };

      await axios.post(webhookUrl, payload);
      console.log("📢 Sent poll closure notification to Slack.");
      return;
    }

    // 📊 Active Poll Message
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `📊 *${poll.question}*`,
        },
      },
      {
        type: "actions",
        elements: [
          ...poll.options.map((option, index) => ({
            type: "button",
            text: {
              type: "plain_text",
              text: `${option.name} (${option.vote_count || 0})`,
              emoji: true,
            },
            value: JSON.stringify({
              pollId: poll._id,
              choice: option.name,
              index,
            }),
            action_id: `vote_${index}`,
          })),
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
      },
    ];

    const payload = {
      blocks,
      text: `Poll: ${poll.question}`,
    };

    await axios.post(webhookUrl, payload);
    console.log("✅ Sent interactive poll to Slack!");
  } catch (error) {
    console.error("❌ Error sending to Slack:", error.response?.data || error.message);
  }
};

module.exports = { sendPollToSlack };
