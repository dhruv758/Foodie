const express = require("express");
const { getZomatoData } = require("../controller/zomatoController");
const Router = express.Router();





Router.post("/api/zomato" , getZomatoData);


module.exports = Router;