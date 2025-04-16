const express = require("express");
const { createPoll } = require("../controller/poll_controller.js");

const router = express.Router();

router.post("/create", createPoll);

module.exports = router;
