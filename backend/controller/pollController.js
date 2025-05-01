const { v4: uuidv4 } = require("uuid");
const ScheduledPoll = require("../model/poll_model");


const getPollSummary = async (req, res) => {
  try {
    const poll = await ScheduledPoll.findById(req.params.pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    const summary = {
      title: poll.question,
      options: poll.options.map((opt) => ({
        name: opt.name,
        url: opt.url,
        vote_count: opt.vote_count,
      })),
    };

    res.json(summary);
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};


const getAllPolls = async (req, res) => {
  try {
    const polls = await ScheduledPoll.find().sort({created_at:-1}); // fetch all polls from DB
    // console.log(polls)
    res.status(200).json(polls);
  } catch (error) {
    console.error(":x: Error fetching polls:", error);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
};


// Updated getVotersByDish function to use findById instead of findOne({ poll_id })
const getVotersByDish = async (req, res) => {
  try {
    const { pollId } = req.params;

    if (!pollId) {
      return res.status(400).json({ error: "Poll ID is required" });
    }

    // Changed from findOne({poll_id: pollId}) to findById(pollId)
    const poll = await ScheduledPoll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const votersByDish = {};
    poll.options.forEach(option => {
      votersByDish[option.name] = {
        id: option.name,
        name: option.name,
        users: []
      };
    });

    poll.votes.forEach(vote => {
      if (votersByDish[vote.choice]) {
        votersByDish[vote.choice].users.push({
          user_id: vote.user_id,
          username: vote.username,
          timestamp: vote.timestamp
        });
      }
    });

    res.status(200).json(Object.values(votersByDish));
  } catch (error) {
    console.error("Error getting voters by dish:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {  getAllPolls, getPollSummary, getVotersByDish };