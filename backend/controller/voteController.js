const { Poll } = require("../model/pollModel");

exports.handleVote = async (slackApp, user_id, username, choice, poll_id) => {
  try {
    if (!user_id) {
      console.error("Missing user_id in vote request");
      return false;
    }

    const poll = await Poll.findOne({ poll_id });
    if (!poll) {
      console.error(`❌ Poll not found with poll_id: ${poll_id}`);
      return false;
    }

    if (poll.status !== 'active') {
      console.log(`Poll ${poll_id} is ${poll.status}, votes not accepted`);
      return false;
    }

    const optionIndex = poll.options.findIndex(opt => opt.name === choice);
    if (optionIndex === -1) {
      console.error(`❌ Option ${choice} not found in poll ${poll_id}`);
      return false;
    }

    const now = new Date();
    const existingVote = poll.votes.find(v => v.user_id === user_id);

    let wasUpdated = false;

    if (existingVote) {
      const prevChoice = existingVote.choice;

      if (prevChoice === choice) {
        console.log(`ℹ️ ${username} already voted for ${choice}, no change`);
      } else {
        // Update the vote's choice and timestamp
        await Poll.updateOne(
          { poll_id, "votes.user_id": user_id },
          {
            $set: {
              "votes.$.choice": choice,
              "votes.$.timestamp": now
            },
            $inc: {
              "options.$[prev].vote_count": -1,
              "options.$[new].vote_count": 1
            }
          },
          {
            arrayFilters: [
              { "prev.name": prevChoice },
              { "new.name": choice }
            ]
          }
        );
        console.log(`🔄 ${username} changed vote from ${prevChoice} to ${choice}`);
        wasUpdated = true;
      }
    } else {
      // First time vote
      await Poll.updateOne(
        { poll_id },
        {
          $push: {
            votes: {
              user_id,
              username,
              choice,
              timestamp: now
            }
          },
          $inc: {
            "options.$[option].vote_count": 1
          }
        },
        {
          arrayFilters: [
            { "option.name": choice }
          ]
        }
      );
      console.log(`✅ ${username} voted for ${choice}`);
    }

    // Fetch updated poll for UI
    const updatedPoll = await Poll.findOne({ poll_id });
    const totalVotes = updatedPoll.votes.length;

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🍽️ *${updatedPoll.title}*\n\n*Total Votes:* ${totalVotes}`
        }
      },
      {
        type: "actions",
        elements: updatedPoll.options.map(option => ({
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
      channel: updatedPoll.channel_id,
      ts: updatedPoll.message_ts,
      blocks: blocks
    });

    // Ephemeral response
    if (updatedPoll.ephemeral_ts?.[user_id]) {
      await slackApp.client.chat.delete({
        token: process.env.SLACK_BOT_TOKEN,
        channel: updatedPoll.channel_id,
        ts: updatedPoll.ephemeral_ts[user_id]
      });
    }

    const responseText = wasUpdated
      ? `🔄 You changed your vote to *${choice}*.`
      : `✅ You voted for *${choice}*. Thanks for participating! 🎉`;

    const ephemeralMessage = await slackApp.client.chat.postEphemeral({
      token: process.env.SLACK_BOT_TOKEN,
      channel: updatedPoll.channel_id,
      user: user_id,
      text: responseText
    });

    const ephemeral_ts = updatedPoll.ephemeral_ts || {};
    ephemeral_ts[user_id] = ephemeralMessage.ts;

    await Poll.updateOne({ poll_id }, { $set: { ephemeral_ts } });

    return true;
  } catch (error) {
    console.error("❌ Error handling vote:", error);
    console.error(error.stack);
    return false;
  }
};
