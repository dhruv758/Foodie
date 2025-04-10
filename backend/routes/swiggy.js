const express = require("express");
const { getZomatoData, getSwigyData, getSwigyRestaurantData, getSeiggyRestaurantMenu, getSwiggyRestaurantMenu } = require("../controller/swiggyController");
const Router = express.Router();





Router.post("/api/zomato" , getZomatoData);
Router.post("/api/swiggy" , getSwigyData);
Router.get("/api/restauant/swiggy" , getSwigyRestaurantData);
Router.get("/api/swiggy/menu",getSwiggyRestaurantMenu)

module.exports = Router;