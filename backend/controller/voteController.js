const { Poll } = require("../model/pollModel");

exports.handleVote = async (slackApp, user_id, username, choice, poll_id) => {
  try {
    if (!user_id) {
      console.error("Missing user_id in vote request");
      return false;
    }
    console.log(`Saving vote: ${username} (${user_id}) voted for ${choice} in poll ${poll_id}`);

    // First, find the poll using findOne
    const poll = await Poll.findOne({ poll_id });
    if (!poll) {
      console.error(`❌ Poll not found with poll_id: ${poll_id}`);
      return false;
    }
    if (poll.status !== 'active') {
      console.log(`Poll ${poll_id} is ${poll.status}, votes not accepted`);
      return false;
    }
    // Find the option that the user is voting for
    const optionIndex = poll.options.findIndex(opt => opt.name === choice);
    if (optionIndex === -1) {
      console.error(`❌ Option ${choice} not found in poll ${poll_id}`);
      return false;
    }

    // Check for existing vote
    const existingVoteIndex = poll.votes.findIndex(vote => vote.user_id === user_id);
    
    // If user has already voted
    if (existingVoteIndex !== -1) {
      const previousChoice = poll.votes[existingVoteIndex].choice;
      
      // Update existing vote with new choice and timestamp
      poll.votes[existingVoteIndex].choice = choice;
      poll.votes[existingVoteIndex].timestamp = new Date();
      
      console.log(`User ${username} changed vote from ${previousChoice} to ${choice}`);
      
      // Remove user from previous option voters list
      // if (previousChoice !== choice) {
      //   const previousOptionIndex = poll.options.findIndex(opt => opt.name === previousChoice);
      //   if (previousOptionIndex !== -1) {
      //     const voterIndex = poll.options[previousOptionIndex].voters.findIndex(
      //       voter => voter.user_id === user_id
      //     );
          
      //     if (voterIndex !== -1) {
      //       poll.options[previousOptionIndex].voters.splice(voterIndex, 1);
      //       poll.options[previousOptionIndex].vote_count = Math.max(0, poll.options[previousOptionIndex].vote_count - 1);
      //     }
      //   }
      // }
    } else {
      // Add new vote
      poll.votes.push({ 
        user_id, 
        username, 
        choice, 
        timestamp: new Date() 
      });
      console.log(`Added new vote for ${username}`);
    }
    // Update the option's voters list and vote count directly
    // const voterExists = poll.options[optionIndex].voters.some(v => v.user_id === user_id);
    
    // if (!voterExists) {
    //   // Add voter to the option's voters array
    //   poll.options[optionIndex].voters.push({
    //     user_id,
    //     username
    //   });
    //   poll.options[optionIndex].vote_count += 1;
    //   console.log(`Added ${username} to voters for ${choice}`);
    // }

    // Mark the modified paths to ensure they're saved
    poll.markModified('votes');
    poll.markModified('options');

    // Save the updated poll
    await poll.save();
    console.log(`Poll ${poll_id} saved with updated votes`);

    // Debug - log the updated poll votes
    console.log(`Current votes in poll ${poll_id}:`, JSON.stringify(poll.votes));
    // console.log(`Current option voters:`, JSON.stringify(poll.options.map(o => ({
    //   name: o.name,
    //   vote_count: o.vote_count,
    //   voters: o.voters
    // }))));

    const totalVotes = poll.votes.length;

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🍽️ *${poll.title}*\n\n*Total Votes:* ${totalVotes}`
        }
      },
      {
        type: "actions",
        elements: poll.options.map(option => ({
          type: "button",
          text: {
            type: "plain_text",
            text: `${option.name} (${option.vote_count})`
          },
          value: `${option.name}_${poll_id}`,
          action_id: `vote_${option.name}`
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

    await slackApp.client.chat.update({
      token: process.env.SLACK_BOT_TOKEN,
      channel: poll.channel_id,
      ts: poll.message_ts,
      blocks: blocks
    });

    console.log("✅ Vote successfully recorded and poll updated in Slack.");
    return true;
  } catch (error) {
    console.error("❌ Error handling vote:", error);
    console.error(error.stack);
    return false;
  }
};
