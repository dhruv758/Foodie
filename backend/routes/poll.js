// routes/poll.js
const express = require('express');
const router = express.Router();
const pollController = require('../controller/pollController');

router.post('/create', pollController.createPoll);

module.exports = router;
