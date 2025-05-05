const { comparePassword, bcryptPassword } = require("../middlewares/authPasswordMiddleware");
const express = require("express")
const jwt = require("jsonwebtoken");
const axios = require("axios")
const userSchema = require("../model/userModel");
const { sendOTPEmail, transporter, sendAuthorityEmail, sendConfirmationEmail, sendRejectionEmail } = require("./emailConfig");
const verifyUserSchema = require("../model/verifyModel");
const nodemailer = require('nodemailer');
const fs = require('fs').promises;;
const path = require('path');
const dotenv = require("dotenv");
dotenv.config()

function generateOTP() {
  // e.g. from 0000 to 9999
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Register Controller
exports.registerVerifyController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // Check if user already exists in main or verify collection
    const [userExist, verifyUserExist] = await Promise.all([
      userSchema.findOne({ email }),
      verifyUserSchema.findOne({ email }),
    ]);

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (verifyUserExist) {
      return res.status(400).json({ message: "Request already sent to admin for approval" });
    }

    // Hash password
    const hashedPassword = await bcryptPassword(password);

    // Prepare new user
    const newUser = new verifyUserSchema({ email, password: hashedPassword });

    // Send email before saving
    await sendAuthorityEmail(email);

    // Save only after email is sent successfully
    await newUser.save();

    return res.status(200).json({ message: "Verification email sent for approval." });

  } catch (error) {
    console.error("Error in registerVerifyController:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.approveUserController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userToApprove = await verifyUserSchema.findOne({ email });
    if (!userToApprove) {
      return res.status(404).json({ message: "User not found in pending verification" });
    }
    
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User is already registered" });
    }

    const newUser = new userSchema({
      email: userToApprove.email,
      password: userToApprove.password, // Assuming password is already hashed
      createdAt: new Date(),
    });
    
    await newUser.save();
    await verifyUserSchema.deleteOne({ email });


    try {
      await sendConfirmationEmail(email);
      console.log("email sent successful");

      return res.status(200).json({ message: "Approval email is been send to the person" });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({ message: "Error sending email." });
    }

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.rejectUserController = async(req,res)=>{
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userToApprove = await verifyUserSchema.findOne({ email });
    if (!userToApprove) {
      return res.status(404).json({ message: "User not found in pending verification" });
    }
    
   
    await verifyUserSchema.deleteOne({ email });


    try {
      await sendRejectionEmail(email);
      console.log("email sent successful");

      return res.status(200).json({ message: "Rejection email had been send to the person" });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({ message: "Error sending email." });
    }

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


// Login Controller
exports.loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }
      
      // Check if user exists
      const user = await userSchema.findOne({ email });
      console.log(!user)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Validate password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
  
      return res.status(200).json({
        message: "Login successful",
        token
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  exports.sendOtpController = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Validate input
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Incomplete credentials: Email is required.",
        });
      }
  
      // Check if user exists
      const userExist = await userSchema.findOne({email });
      if (!userExist) {
        return res.status(404).json({
          success: false,
          message: "User is not registered.",
        });
      }
      
      console.log(userExist);
      // Generate and send OTP
      const otp = generateOTP();
  
      try {
        await sendOTPEmail(email, otp);
      } catch (err) {
        console.error("Error sending OTP email:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP email. Please try again.",
        });
      }
  
      // Save OTP to the user record
      userExist.otp = otp;
      await userExist.save();
  
      return res.status(202).json({
        success: true,
        message: "OTP sent to email successfully.",
        username: userExist.username,
        id: userExist._id,
      });
  
    } catch (error) {
      console.error("Internal Server Error:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  exports.verifyOtpController = async(req,res)=>{

    const{otp , email}= req.body;
    // console.log(req.body);
      // Check if email and OTP are provided
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required." });
      }

      try {
        // Find user by email
        const user = await userSchema.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }
        // console.log(user);
        // Verify the OTP stored in the database against the one provided
        if (user.otp != otp) {
          return res.status(401).json({ error: "Invalid OTP." });
        }

        // OTP is valid, optionally update user status or clear OTP here
        // e.g., user.otp = null; user.isVerified = true; await user.save();

        return res.status(200).json({ message: "OTP verified successfully." });
      } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ error: "Server error." });
      }



  }

  exports.updatePasswordController = async(req,res)=>{

    const {email ,newPassword} = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required.' });
    }

    try {
      // Find user by email
      const user = await userSchema.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Hash the new password
      const hashedPassword = await bcryptPassword(newPassword);
  
      // Update the user's password and save
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }

  }



