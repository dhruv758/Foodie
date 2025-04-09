const express = require("express");
const { getZomatoData, getSwigyData, getSwigyRestaurantData } = require("../controller/swiggyController");
const Router = express.Router();





Router.post("/api/zomato" , getZomatoData);
Router.post("/api/swiggy" , getSwigyData);
Router.get("/api/restauant/swiggy" , getSwigyRestaurantData);


module.exports = Router;