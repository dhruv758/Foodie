const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  poll_id: {
    type: String,
    required: true,
    unique: true
  },
  message_ts: {
    type: String,
    required: true
  },
  channel_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  options: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    }
  ],
  votes: [
    {
      user_id: { type: String, required: true },
      username: { type: String, required: true },
      choice: { type: String, required: true }, // This refers to the food option name
      timestamp: { type: Date, default: Date.now }
    }
  ],
  status: { 
    type: String, 
    enum: ['active', 'closed'], 
    default: 'active' 
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date,
    required: true
  }
});

// Add indexes to help with querying
pollSchema.index({ "votes.user_id": 1 });
pollSchema.index({ "votes.choice": 1 });

const Poll = mongoose.model("Poll", pollSchema);

module.exports = { Poll };