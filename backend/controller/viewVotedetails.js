const { Poll } = require('../model/pollModel');

async function viewVoteDetails(poll_id) {
  try {
    const poll = await Poll.findOne({ poll_id });
    if (!poll) {
      throw new Error(`Poll not found with id: ${poll_id}`);
    }

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${poll.title} - Vote Details*`
        }
      }
    ];

    for (const option of poll.options) {
      // Find usernames of all voters who chose this option
      const votersForOption = poll.votes
        .filter(vote => vote.choice === option.name)
        .map(vote => vote.username);

      const votersList = votersForOption.length > 0 
        ? votersForOption.join(', ')
        : 'No votes yet';

      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${option.name}* (${option.vote_count})\n${votersList}`
        }
      });
    }

    blocks.push({ type: "divider" });

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Debug - Raw Vote Data:*\n${poll.votes.map(v => `${v.username}: ${v.choice}`).join('\n')}`
      }
    });

    return blocks;
  } catch (error) {
    console.error("❌ Error viewing vote details:", error);
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Error loading vote details: ${error.message}`
        }
      }
    ];
  }
}

module.exports = {viewVoteDetails};
