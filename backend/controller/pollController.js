const Poll = require('../model/pollModel');
const agenda = require('../config/agenda');
const sendPollToSlack = require('../services/slackService');

exports.createPoll = async (req, res) => {
  try {
    console.log("📥 Incoming Poll Request Body:", req.body);

    const poll = new Poll(req.body);
    await poll.save();
    console.log("✅ Poll saved to DB:", poll);

    // Handle immediate send
    if (poll.scheduleType === 'sendNow') {
      await sendPollToSlack(poll);
      poll.status = 'sent';
      await poll.save();
      console.log("📤 Poll sent immediately to Slack.");
    }

    // Handle scheduled sending
    else if (poll.scheduleType === 'schedule') {
      if (poll.recurringType === 'oneTime') {
        await agenda.schedule(new Date(poll.startDateTime), 'send-poll', { pollId: poll._id });
        console.log(`⏰ One-time poll scheduled at ${poll.startDateTime}`);
      } 
      else if (poll.recurringType === 'recurring') {
        // Note: 'check-recurring-polls' should be scheduled ONCE during agenda startup
        console.log("🔁 Recurring poll setup — poll will be picked by agenda job on matching days.");
      }
    }

    res.status(200).json({ message: '✅ Poll created and processed', poll });
  } catch (err) {
    console.error("❌ Error in createPoll:", err);
    res.status(500).json({ error: 'Failed to create poll' });
  }
};
