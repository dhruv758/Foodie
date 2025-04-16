const express = require("express");
const { createPoll, createInstantPoll } = require("../controller/poll_controller");

const Router = express.Router();

Router.post("/create", createPoll);
Router.post("/poll-start", createInstantPoll);

module.exports = Router;
