const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  pollId: mongoose.Schema.Types.ObjectId,
  userId: String,
  username: String,
  choice: String,
  votedAt: {
    type: Date,
    default: Date.now,
  },
});

// To avoid OverwriteModelError in development
const Vote = mongoose.models.Vote || mongoose.model("Vote", VoteSchema);

module.exports = Vote;
