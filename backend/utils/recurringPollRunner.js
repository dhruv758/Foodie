const cron = require("node-cron");
const dayjs = require("dayjs");
const ScheduledPoll = require("../model/poll_model.js");
const { sendPollToSlack } = require("../utils/slack.js");

// Run every minute
cron.schedule("*/1 * * * *", async () => {
  const now = dayjs();
  const currentTime = now.toDate();
  const today = now.format("ddd"); // e.g., "Mon", "Tue"

  try {
    const polls = await ScheduledPoll.find({
      scheduleType: "schedule",
      recurringType: "recurring",
      selectedDays: today,
      startDateTime: { $lte: currentTime },
      endDateTime: { $gte: currentTime },
    });

    for (const poll of polls) {
      // Optional: avoid sending multiple times in a day
      if (poll.lastSentAt && dayjs(poll.lastSentAt).isSame(now, "day")) {
        continue; // already sent today
      }

      console.log(`🔁 Sending recurring poll [${poll._id}] on ${today}...`);

      await sendPollToSlack(poll);

      poll.lastSentAt = currentTime;
      await poll.save();
    }
  } catch (err) {
    console.error("❌ Error in recurring poll runner:", err.message);
  }
});
