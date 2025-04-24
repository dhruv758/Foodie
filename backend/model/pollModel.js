// const mongoose = require("mongoose");

// const pollSchema = new mongoose.Schema({
//   poll_id: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   message_ts: {
//     type: String,
//     required: true
//   },
//   channel_id: {
//     type: String,
//     required: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   options: [
//     {
//       name: { type: String, required: true },
//       url: { type: String, required: true },
//       vote_count: { type: Number, default: 0 },
//     }
//   ],
//   votes: [
//     {
//       user_id: { type: String, required: true },
//       username: { type: String, required: true },
//       choice: { type: String, required: true }, // This refers to the food option name
//       timestamp: { type: Date, default: Date.now }
//     }
//   ],
//   status: { 
//     type: String, 
//     enum: ['active', 'closed'], 
//     default: 'active' 
//   },
//   created_at: {
//     type: Date,
//     default: Date.now
//   },
//   expires_at: {
//     type: Date,
//     required: true
//   },
//   ephemeral_ts: {type: Map, of: String } 
// });

// // Pre-save middleware to update option vote counts and voters
// pollSchema.pre('save', function(next) {
//   // Skip this middleware if votes aren't modified
//   if (!this.isModified('votes')) {
//     return next();
//   }
  
//   // Reset all option vote counts and voters
//   this.options.forEach(option => {
//     option.vote_count = 0;
//   });
  
//   // Update option vote counts based on votes array
//   this.votes.forEach(vote => {
//     const option = this.options.find(opt => opt.name === vote.choice);
//     if (option) {
//       option.vote_count += 1;
//     }
//   });
  
//   next();
// });

// // Add indexes to help with querying
// pollSchema.index({ "votes.user_id": 1 });
// pollSchema.index({ "votes.choice": 1 });
// pollSchema.index({ "options.name": 1 });

// const Poll = mongoose.model("Poll", pollSchema);
// // const pollSchema = new mongoose.Schema({ ... }, { versionKey: false });


// module.exports = { Poll };