const express = require("express");
const { registerController, loginController, sendOtpController, verifyOtpController, updatePasswordController } = require("../controller/authController");
const Router = express.Router();





Router.post("/register", registerController);
Router.post("/login", loginController);
Router.post("/send-otp", sendOtpController)
Router.post("/verify-otp", verifyOtpController)
Router.put("/update-password", updatePasswordController)

module.exports = Router;