const express = require("express");
const { loginController, sendOtpController, verifyOtpController, updatePasswordController, registerVerifyController, approveUserController, rejectUserController } = require("../controller/authController");
const Router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { transporter } = require("../controller/emailConfig");




Router.post("/register-verify", registerVerifyController);
Router.post("/registration-approved" , approveUserController)
Router.post("/registration-rejected" , rejectUserController)
Router.post("/login", loginController);
Router.post("/send-otp", sendOtpController)
Router.post("/verify-otp", verifyOtpController)
Router.put("/update-password", updatePasswordController)


module.exports = Router;