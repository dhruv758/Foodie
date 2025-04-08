// model/pollModel.js
const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: String,
  choices: [String],
  allowMultipleVotes: Boolean,
  scheduleType: { type: String, enum: ['sendNow', 'schedule'] },
  recurringType: { type: String, enum: ['oneTime', 'recurring'], default: 'oneTime' },
  selectedDays: [String],
  startDateTime: Date,
  endDateTime: Date,
  status: { type: String, enum: ['scheduled', 'sent', 'expired'], default: 'scheduled' }
});

module.exports = mongoose.model('Poll', pollSchema);
