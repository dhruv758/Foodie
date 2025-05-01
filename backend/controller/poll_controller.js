const cron = require("node-cron");
const axios = require('axios');
const dayjs = require("dayjs");
const ScheduledPoll = require("../model/poll_model");
const { sendPollToSlack } = require("../utils/slack");
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const slackToken = process.env.SLACK_BOT_TOKEN;
const slackChannelId = process.env.SLACK_CHANNEL;
const web = new WebClient(slackToken);

const createPoll = async (req, res) => {
  try {
    const {
      question,
      choices, // still coming from frontend
      scheduleType,
      startDateTime,
      endDateTime,
      recurringType,
      selectedDays,
    } = req.body;

    // ✅ Validate core fields
    if (!question || !choices || choices.length === 0 || !endDateTime) {
      return res.status(400).json({ message: "Required fields missing." });
    }

    const end = new Date(endDateTime);
    if (isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid endDateTime format." });
    }

    const now = new Date();
    if (end <= now) {
      console.log("DQwdqw");
      return res.status(400).json({ message: "endDateTime must be in the future." });
    }

    let start = null;
    if (scheduleType === "schedule") {
      start = new Date(startDateTime);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid startDateTime format." });
      }
      if (start <= now) {
        return res.status(400).json({ message: "startDateTime must be in the future." });
      }
      if (end <= start) {
        return res.status(400).json({ message: "endDateTime must be after startDateTime." });
      }
    }

    // 🔁 Convert `choices` into `options` expected by schema
    const options = choices.map((choice) => ({
      name: choice,
      url: "",
      vote_count: 0,
    }));

    const poll = new ScheduledPoll({
      question,
      options,
      scheduleType,
      startDateTime: scheduleType === "schedule" ? startDateTime : null,
      endDateTime,
      recurringType,
      selectedDays: recurringType === "recurring" ? selectedDays : [],
    });

    const savedPoll = await poll.save();

    // 🕒 Schedule or send immediately
    if (scheduleType === "schedule" && start) {
      const cronTime = `${start.getMinutes()} ${start.getHours()} ${start.getDate()} ${start.getMonth() + 1} *`;
      cron.schedule(cronTime, async () => {
        console.log("📩 Sending scheduled poll to Slack...");
        await sendPollToSlack(savedPoll);
      });
      console.log("⏰ Slack message scheduled at:", cronTime);
    } else {
      await sendPollToSlack(savedPoll);
    }

    // 🔒 Auto-close logic
    const endCron = `${end.getMinutes()} ${end.getHours()} ${end.getDate()} ${end.getMonth() + 1} *`;
    cron.schedule(endCron, async () => {
      try {
        const pollToUpdate = await ScheduledPoll.findById(savedPoll._id);
        if (!pollToUpdate) return;

        pollToUpdate.isClosed = true;
        pollToUpdate.totalVotes = pollToUpdate.votes.length;

        await pollToUpdate.save();

        console.log(`🔒 Poll [${pollToUpdate._id}] closed. Total votes: ${pollToUpdate.totalVotes}`);

        await sendPollToSlack({
          ...pollToUpdate._doc,
          notifyOnly: true,
        });
      } catch (err) {
        console.error("❌ Error while closing poll and notifying Slack:", err.message);
      }
    });

    console.log("📅 Poll will be auto-closed at:", endCron);

    res.status(201).json({ message: "Poll created successfully!", poll: savedPoll });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createInstantPoll = async (req, res) => {
  try {
    console.log(req.body);

    const {
      question,
      choices, // still coming from frontend
      startDateTime,
      endDateTime,
    } = req.body;

    // ✅ Validate core fields
    if (!question || !choices || choices.length === 0 || !endDateTime) {
      
      return res.status(400).json({ message: "Required fields missing." });
    }

    const end = new Date(endDateTime);
    if (isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid endDateTime format." });
    }

    const now = new Date();
    if (end <= now) {
      console.log("DQwdqw");
      return res.status(400).json({ message: "endDateTime must be in the future." });
    }

    let start = null;
    
    // 🔁 Convert `choices` into `options` expected by schema
    const options = choices.map((choice) => ({
      name: choice.name,
      url: choice.url,
      vote_count: 0,
    }));
    console.log(options)

    const poll = new ScheduledPoll({
      question,
      options,
      startDateTime,
      endDateTime,
    });
    const savedPoll = await poll.save();

    await sendPollToSlack(savedPoll);

    // 🔒 Auto-close logic
    const endCron = `${end.getMinutes()} ${end.getHours()} ${end.getDate()} ${end.getMonth() + 1} *`;
    cron.schedule(endCron, async () => {
      try {
        const pollToUpdate = await ScheduledPoll.findById(savedPoll._id);
        if (!pollToUpdate) return;

        pollToUpdate.isClosed = true;
        pollToUpdate.totalVotes = pollToUpdate.votes.length;

        await pollToUpdate.save();

        console.log(`🔒 Poll [${pollToUpdate._id}] closed. Total votes: ${pollToUpdate.totalVotes}`);

        await sendPollToSlack({
          ...pollToUpdate._doc,
          notifyOnly: true,
        });
      } catch (err) {
        console.error("❌ Error while closing poll and notifying Slack:", err.message);
      }
    });

    console.log("📅 Poll will be auto-closed at:", endCron);

    res.status(201).json({ message: "Poll created successfully!", poll: savedPoll });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleArrival = async (req, res) => {
  const {name} = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'Name is required' });
  } 

  try {
    const result = await web.chat.postMessage({
      channel: slackChannelId,
      text: `🏢 *${name}* has arrived at the office!`,
    });
    console.log(result);

    if (result.ok) {
      return res.status(200).json({ success: true, message: 'Message sent to Slack' });
    } else {
      return res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Slack send error:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to send message to Slack' });
  }
};
const deletePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    if (!pollId) {
      return res.status(400).json({ success: false, message: "Poll ID is required." });
    }

    const poll = await ScheduledPoll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ success: false, message: "Poll not found." });
    }

    const slackToken = process.env.SLACK_BOT_TOKEN;
    const slackChannel = poll.slackChannel;
    const slackTs = poll.slackTs;

    if (slackChannel && slackTs) {
      const deleteResponse = await axios.post(
        'https://slack.com/api/chat.delete',
        {
          channel: slackChannel,
          ts: slackTs,
        },
        {
          headers: {
            Authorization: `Bearer ${slackToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!deleteResponse.data.ok) {
        console.error("Slack delete failed:", deleteResponse.data.error);
      } else {
        console.log("Slack message deleted.");
      }
    } else {
      console.warn("No Slack message info available. Skipping Slack delete.");
    }

    await ScheduledPoll.findByIdAndDelete(pollId);

    return res.status(200).json({ success: true, message: "Poll deleted successfully." });
  } catch (error) {
    console.error("Error deleting poll:", error.message);
    return res.status(500).json({ success: false, message: "Server error deleting poll." });
  }
};



module.exports = {
  createPoll,
  createInstantPoll,
  handleArrival,
  deletePoll,
};
