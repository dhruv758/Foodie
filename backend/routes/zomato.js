const express = require("express");
const { getZomatoData } = require("../controller/zomatoController");
const Router = express.Router();





Router.get("/api/zomato" , getZomatoData);


module.exports = Router;