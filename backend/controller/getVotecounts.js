// const { Poll } = require('../model/pollModel');

// async function getVoteCounts(poll_id) {
//   try {
//     const poll = await Poll.findOne({ poll_id });
//     if (!poll) {
//       throw new Error(`Poll not found with id: ${poll_id}`);
//     }

//     const voteCounts = {};
//     poll.options.forEach(option => {
//       voteCounts[option.name] = option.vote_count;
//     });

//     return voteCounts;
//   } catch (error) {
//     console.error(`Error getting vote counts for poll ${poll_id}:`, error);
//     return {};
//   }
// }

// module.exports = {getVoteCounts};