const express = require("express");
const { createPoll, createInstantPoll, handleArrival, deletePoll } = require("../controller/poll_controller"); // ✅ Correct import

const Router = express.Router();

Router.post("/create", createPoll);
Router.post("/poll-start", createInstantPoll);
Router.post("/done", handleArrival);
Router.delete("/delete/:pollId", deletePoll); 

module.exports = Router;
