const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  poll_id: {
    type: String, 
    required: true,
    ref: 'Poll',
    index: true
  },
  user_id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  choice: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

VoteSchema.index({ poll_id: 1, user_id: 1 });

const Vote = mongoose.model("Vote", VoteSchema);

module.exports = { Vote };