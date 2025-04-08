// config/agenda.js
const Agenda = require('agenda');
const sendPollToSlack = require('../services/slackService');
const Poll = require('../model/pollModel');

// const agenda = new Agenda({ db: { address: process.env.MONGO_URI, collection: 'agendaJobs' } });
const agenda = new Agenda({ db: { address: process.env.MONGO_URL, collection: 'agendaJobs' } });


agenda.define('send-poll', async (job) => {
  const { pollId } = job.attrs.data;
  const poll = await Poll.findById(pollId);
  if (!poll || poll.status === 'sent') return;
  await sendPollToSlack(poll);
  poll.status = 'sent';
  await poll.save();
});

agenda.define('check-recurring-polls', async () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }); // e.g. Mon, Tue
  const polls = await Poll.find({
    scheduleType: 'schedule',
    recurringType: 'recurring',
    selectedDays: { $in: [today] },
  });

  for (const poll of polls) {
    agenda.schedule(new Date(poll.startDateTime), 'send-poll', { pollId: poll._id });
  }
});

(async () => {
  await agenda.start();
})();

module.exports = agenda;
