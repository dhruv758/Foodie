const express = require("express");
const router = express.Router();
const axios = require("axios");
const Poll = require("../model/poll_model");

router.post("/interact", express.urlencoded({ extended: true }), async (req, res) => {
  try {

    console.log("dqwdqw")
    const payload = JSON.parse(req.body.payload);
    const { user, actions, trigger_id } = payload;

    // 📊 View Responses
    if (actions[0].action_id === "view_votes") {
      const { pollId } = JSON.parse(actions[0].value);
      const poll = await Poll.findById(pollId);

      // Group votes by option
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
        ...poll.options.map(opt => ({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${opt.name}* (${opt.vote_count || 0} votes)\n${voteMap[opt.name]?.join("\n") || "_No votes yet_"}`,
          },
        })),
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

    // 🗳️ Voting logic
    const { value } = actions[0];
    const data = JSON.parse(value);
    const { pollId, choice, index } = data;

    const poll = await Poll.findById(pollId);

    // ❌ Poll closed check
    const now = new Date();
    if (poll.isClosed || (poll.endDateTime && now > new Date(poll.endDateTime))) {
      return res.send({
        response_type: "ephemeral",
        text: "❌ This poll is closed. You cannot vote anymore.",
      });
    }

    const existingVote = poll.votes.find(v => v.user_id === user.id);
    let changedVote = false;

    // Decrease old vote count if changed
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

    // Increment new vote count
    const selectedOption = poll.options.find(opt => opt.name === choice);
    if (selectedOption) {
      selectedOption.vote_count = (selectedOption.vote_count || 0) + 1;
    }

    await poll.save();

    // Create updated poll blocks with vote counts
    const buttonBlock = {
      type: "actions",
      elements: [
        ...poll.options.map((opt, i) => ({
          type: "button",
          text: {
            type: "plain_text",
            text: `${opt.name} (${opt.vote_count || 0})`,
            emoji: true,
          },
          value: JSON.stringify({
            pollId,
            choice: opt.name,
            index: i,
          }),
          action_id: `vote_${i}`,
        })),
        {
          type: "button",
          text: { type: "plain_text", text: "📊 View Responses" },
          value: JSON.stringify({ pollId }),
          action_id: "view_votes",
        },
      ],
    };

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
      buttonBlock,
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
