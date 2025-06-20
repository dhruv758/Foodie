const express = require("express");
const { getZomatoData, getSwigyData, getSwigyRestaurantData, getSeiggyRestaurantMenu, getSwiggyRestaurantMenu } = require("../controller/swiggyController");
const { launchSwiggyScript } = require("../controller/launchController");
const Router = express.Router();




Router.post("/api/zomato" , getZomatoData);
Router.post("/api/swiggy" , getSwigyData);
Router.get("/api/restauant/swiggy" , getSwigyRestaurantData);
Router.get("/api/swiggy/menu",getSwiggyRestaurantMenu)

Router.post("/trigger", launchSwiggyScript);
Router.post("/api/launch-swiggy", launchSwiggyScript);
module.exports = Router;