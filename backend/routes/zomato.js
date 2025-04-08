const express = require("express");
const { getZomatoData, getSwigyData } = require("../controller/zomatoController");
const Router = express.Router();





Router.post("/api/zomato" , getZomatoData);
Router.post("/api/swiggy" , getSwigyData);


module.exports = Router;