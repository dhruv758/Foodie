const {Poll} = require('../model/pollModel'); // adjust path as needed

async function getPollById(req, res) {
  try {
    const { pollId } = req.params;
    
    if (!pollId) {
      return res.status(400).json({ error: "Poll ID is required" });
    }
    const poll = await Poll.findOne({ poll_id: pollId });
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    
    const optionsWithVotes = poll.options.map(option => ({
      name: option.name,
      url: option.url,
      vote_count: option.vote_count,
    //   voters: option.voters
    }));
    
    const response = {
      poll_id: poll.poll_id,
      title: poll.title,
      options: optionsWithVotes,
      status: poll.status,
      created_at: poll.created_at,
      expires_at: poll.expires_at,
      total_votes: poll.votes.length
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error(`❌ Error finding poll:`, error);
    res.status(500).json({ error: "Error retrieving poll" });
  }
}

module.exports = {getPollById};
