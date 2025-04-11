const {Poll} = require('../model/pollModel'); // Adjust the path as needed

async function getAllPolls(req, res) {
  try {
    const { status } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    
    const polls = await Poll.find(query).select(
      'poll_id title status created_at expires_at options.name options.vote_count'
    );

    const formattedPolls = polls.map(poll => ({
      poll_id: poll.poll_id,
      title: poll.title,
      status: poll.status,
      created_at: poll.created_at,
      expires_at: poll.expires_at,
      options: poll.options.map(opt => ({
        name: opt.name,
        vote_count: opt.vote_count
      })),
      total_votes: poll.options.reduce((sum, opt) => sum + opt.vote_count, 0)
    }));

    res.status(200).json(formattedPolls);
  } catch (error) {
    console.error("❌ Error getting polls:", error);
    res.status(500).json({ error: "Error retrieving polls" });
  }
}

module.exports = {getAllPolls};
