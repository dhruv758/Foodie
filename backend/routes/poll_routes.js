const express = require("express");
const { createPoll, createInstantPoll, handleArrival } = require("../controller/poll_controller");

const Router = express.Router();

Router.post("/create", createPoll);
Router.post("/poll-start", createInstantPoll);
Router.post('/done', handleArrival);

module.exports = Router;
