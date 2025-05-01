const mongoose = require('mongoose');

const ScheduledPollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      name: { type: String, required: true },
      url: { type: String },
      vote_count: { type: Number, default: 0 },
    },
  ],
  scheduleType: {
    type: String,
    enum: ["sendNow", "schedule"],
    default: "sendNow",
  },
  startDateTime: { type: Date },
  endDateTime: { type: Date, required: true },
  recurringType: {
    type: String,
    enum: ["oneTime", "recurring"],
    default: "oneTime",
  },
  selectedDays: {
    type: [String],
    validate: {
      validator: function (val) {
        if (this.recurringType === "recurring") return val.length > 0;
        return true;
      },
      message: "At least one day must be selected for recurring polls.",
    },
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  slackTs: { type: String },
 slackChannel: { type: String },
  votes: [
    {
      user_id: { type: String, required: true },
      username: { type: String, required: true },
      choice: { type: String, required: true },
      votedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  lastSentAt: { type: Date },
});

const ScheduledPoll = mongoose.models.ScheduledPoll || mongoose.model('ScheduledPoll', ScheduledPollSchema);
module.exports = ScheduledPoll;
