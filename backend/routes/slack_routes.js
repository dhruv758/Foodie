const express = require("express");
const router = express.Router();
const axios = require("axios");
const Poll = require("../model/poll_model");

router.post("/interact", express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    const { user, actions, trigger_id } = payload;

    // 📊 View Responses Modal
    if (actions[0].action_id === "view_votes") {
      const { pollId } = JSON.parse(actions[0].value);
      const poll = await Poll.findById(pollId);

      if (!poll) {
        console.error("❌ Poll not found for ID:", pollId);
        return res.status(404).send("Poll not found");
      }

      const totalVotes = poll.votes.length || 1;
      const voteMap = {};
      for (const option of poll.options) {
        voteMap[option.name] = [];
      }

      for (const vote of poll.votes) {
        if (!voteMap[vote.choice]) voteMap[vote.choice] = [];
        voteMap[vote.choice].push(`<@${vote.user_id}>`);
      }

      const blocks = [
        {
          type: "section",
          text: { type: "mrkdwn", text: `📊 *${poll.question}* — *Results*` },
        },
        ...poll.options.map(opt => {
          const percentage = ((opt.vote_count / totalVotes) * 100).toFixed(1);
          return {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${opt.name}*\n${opt.vote_count} vote${opt.vote_count !== 1 ? "s" : ""} • ${percentage}%\n${voteMap[opt.name]?.join("\n") || "_No votes yet_"}`,
            },
          };
        }),
      ];

      await axios.post("https://slack.com/api/views.open", {
        trigger_id,
        view: {
          type: "modal",
          title: { type: "plain_text", text: "Poll Results" },
          close: { type: "plain_text", text: "Close" },
          blocks,
        },
      }, {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      return res.send();
    }

    // 🗳️ Handle Vote
    const { pollId, choice, index } = JSON.parse(actions[0].value);
    const poll = await Poll.findById(pollId);

    if (!poll) {
      console.error("❌ Poll not found for ID:", pollId);
      return res.status(404).send("Poll not found");
    }

    const now = new Date();
    if (poll.isClosed || (poll.endDateTime && now > new Date(poll.endDateTime))) {
      return res.send({
        response_type: "ephemeral",
        text: "❌ This poll is closed. You cannot vote anymore.",
      });
    }

    const existingVote = poll.votes.find(v => v.user_id === user.id);
    let changedVote = false;

    if (existingVote) {
      if (existingVote.choice === choice) {
        return res.send({
          response_type: "ephemeral",
          text: `⚠️ You already voted for *${choice}*.`,
        });
      }

      const oldOption = poll.options.find(opt => opt.name === existingVote.choice);
      if (oldOption && oldOption.vote_count > 0) oldOption.vote_count -= 1;

      existingVote.choice = choice;
      existingVote.username = user.username;
      existingVote.votedAt = now;
      changedVote = true;
    } else {
      poll.votes.push({
        user_id: user.id,
        username: user.username,
        choice,
        votedAt: now,
      });
    }

    const selectedOption = poll.options.find(opt => opt.name === choice);
    if (selectedOption) {
      selectedOption.vote_count = (selectedOption.vote_count || 0) + 1;
    }

    await poll.save();

    const totalVotes = poll.votes.length || 1;

    const optionBlocks = poll.options.map((opt, i) => {
      const percentage = ((opt.vote_count / totalVotes) * 100).toFixed(1);
      return {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${opt.name}*\n${opt.vote_count} vote${opt.vote_count !== 1 ? "s" : ""} • ${percentage}%`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Vote",
            emoji: true,
          },
          value: JSON.stringify({
            pollId,
            choice: opt.name,
            index: i,
          }),
          action_id: `vote_${i}`,
        },
      };
    });

    const closingTime = new Date(poll.endDateTime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    const blocks = [
      {
        type: "section",
        text: { type: "mrkdwn", text: `📊 *${poll.question}*` },
      },
      ...optionBlocks,
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "📊 View Responses" },
            value: JSON.stringify({ pollId }),
            action_id: "view_votes",
          },
        ],
      },
      {
        type: "context",
        elements: [
          { type: "mrkdwn", text: `🧮 *Total Votes:* ${poll.votes.length}` },
          { type: "mrkdwn", text: `⏰ *Closes:* ${closingTime}` },
        ],
      },
    ];

    await axios.post(payload.response_url, {
      replace_original: true,
      blocks,
    });

    await axios.post("https://slack.com/api/chat.postEphemeral", {
      channel: payload.channel.id,
      user: user.id,
      text: changedVote
        ? `✅ You changed your vote to *${choice}*`
        : `✅ Your vote for *${choice}* has been recorded!`,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.send();
  } catch (err) {
    console.error("❌ Slack interaction error:", err);
    res.status(500).send();
  }
});

module.exports = router;