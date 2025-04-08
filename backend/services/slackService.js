// services/slackService.js
const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_BOT_TOKEN;
const channel = process.env.SLACK_CHANNEL_ID;

const slack = new WebClient(token);

module.exports = async function sendPollToSlack(poll) {
  const blocks = [
    { type: 'section', text: { type: 'mrkdwn', text: `*${poll.question}*` } },
    {
      type: 'actions',
      elements: poll.choices.map((choice) => ({
        type: 'button',
        text: { type: 'plain_text', text: choice },
        value: choice,
      })),
    },
  ];

  await slack.chat.postMessage({
    channel,
    text: poll.question,
    blocks,
  });
};
