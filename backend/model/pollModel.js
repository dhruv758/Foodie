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
      url: { type: String, required: true }
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

const Poll = mongoose.model("Poll", pollSchema);

module.exports = { Poll };
