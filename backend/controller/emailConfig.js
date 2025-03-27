const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.pass_key
    }
});
async function sendOTPEmail(email, otp) {
    try {
      const mailOptions = {
        from: 'priyanshugupta.112002@gmail.com',
        to: email,
        subject: 'Your OTP for Registration',
        text: `Your OTP is: ${otp}`,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.response}`);
      return { success: true };
    } catch (error) {
      console.error(`Error sending OTP email: ${error}`);
      return { success: false, error };
    }
  }
  
  module.exports = { sendOTPEmail };