const express = require("express");
const {getAllPolls} =require("../controller/pollController");
const {getPollSummary} =require("../controller/pollController"); 
const {getVotersByDish} =require("../controller/pollController");


const Router = express.Router();

Router.get("/poll/all", getAllPolls);
Router.get("/poll/summary/:pollId", getPollSummary);
Router.get('/poll/:pollId/voters', getVotersByDish);

module.exports = Router;

