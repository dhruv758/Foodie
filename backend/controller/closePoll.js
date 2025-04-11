const { Poll } = require('../model/pollModel');
const { slackApp } = require('../slack/app'); // adjust this import as per your project structure

async function closePoll(channelId, messageTs, poll_id) {
  try {
    const poll = await Poll.findOne({ poll_id });
    if (!poll) {
      console.error(`Poll not found: ${poll_id}`);
      return;
    }
    const resultText = poll.options
      .map(option => `${option.name}: ${option.vote_count}`)
      .join("\n");

    const finalText = `🚫 *Poll Closed!* Voting is no longer available.\n\n${resultText}`;

    await slackApp.client.chat.update({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channelId,
      ts: messageTs,
      text: finalText,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: finalText
          }
        }
      ]
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

module.exports = {closePoll};
