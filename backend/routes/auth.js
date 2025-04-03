const express = require("express");
const { registerController, loginController, sendOtpController, verifyOtpController, updatePasswordController, registerVerifyController } = require("../controller/authController");
const Router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { transporter } = require("../controller/emailConfig");




Router.post("/register-verify", registerVerifyController);
Router.post("/login", loginController);
Router.post("/send-otp", sendOtpController)
Router.post("/verify-otp", verifyOtpController)
Router.put("/update-password", updatePasswordController)

// Router.post('/send-email', (req, res) => {
//     console.log("Sending");
//     const { email, password, name , } = req.body;
//     console.log(email, password, name);

    

//     // Read the HTML template file
//     // const templatePath = path.join(__dirname,"..", 'public', 'emailtemplate.html');
//     const templatePath = path.join(__dirname, "..", "emailTemplate", "emailTemp.html");
//     fs.readFile(templatePath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).send('Error reading email template.');
//         }

//         // const imagePath = path.join(__dirname, 'images', 'banner.png');
//         // const base64Image = fs.readFileSync(imagePath, 'base64');
//         // const base64ImageString = `${base64Image}`;


//         // Replace placeholders with actual values
//         let customizedTemplate = data.replace('{{name}}', name)
//                                      .replace('{{email}}', email)
//                                      .replace('{{password}}', password);
//                                      //.replace('{{base64Image}}', base64ImageString);

//         // Customize the email content with user-specific details
//         const mailOptions = {
//             from: 'priyanshugupta.112002@gmail.com',
//             to: email,
//             subject: 'Librarian Credentials',
//             html: customizedTemplate
//         };

//         // Send email
//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return res.status(500).send(error.toString());
//             }
//             res.status(200).send('Email sent: ' + info.response);
//         });
//     });
// });


// Router.post('/send-email', (req, res) => {
//     console.log("Sending");
//     const { email, password } = req.body;
//     console.log(email, password);

    

//     // Read the HTML template file
//     const authEmail = "priyanshugupta.112002@gmail.com";

//       const templatePath = path.join(__dirname, '..', 'emailTemplate', 'emailTemp.html');
//       console.log(templatePath)
  
  
//       fs.readFile(templatePath, 'utf8', (err, data) => {
//         if (err) {
//           return callback(new Error('Error reading email template: ' + err.message));
//         }
    
//         const customizedTemplate = data
//           .replace('{{email}}', user.email)
//           .replace('{{acceptUrl}}', `http://example.com/accept?user=${encodeURIComponent(user.email)}`)
//           .replace('{{rejectUrl}}', `http://example.com/reject?user=${encodeURIComponent(user.email)}`);
    
//         const mailOptions = {
//           from: 'priyanshugupta.112002@gmail.com',
//           to: authEmail,
//           subject: 'Permission for a new user wants to register',
//           html: customizedTemplate,
  
//         };
    
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             return callback(new Error('Error sending email: ' + error.message));
//           }
//           callback(null, `Email sent: ${info.response}`);
//         });
//       });
// });

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.email,
//         pass: process.env.pass_key
//     }
// });


// Router.post('/send-email', (req, res) => {
//     console.log("Sending");
//     // const { email, password, name , } = req.body;
//     const email = "priyanshugupta.112002@gmail.com"
//     const password ="12"
//     const name = "dqwdqw" 
//     console.log(email, password, name);

    

//     // Read the HTML template file
//     const templatePath = path.join(__dirname,"..", 'public', 'emailtemplate.html');
//     fs.readFile(templatePath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).send('Error reading email template.');
//         }

//         // const imagePath = path.join(__dirname, 'images', 'banner.png');
//         // const base64Image = fs.readFileSync(imagePath, 'base64');
//         // const base64ImageString = `${base64Image}`;


//         // Replace placeholders with actual values
//         let customizedTemplate = data.replace('{{name}}', name)
//                                      .replace('{{email}}', email)
//                                      .replace('{{password}}', password);
//                                      //.replace('{{base64Image}}', base64ImageString);

//         // Customize the email content with user-specific details
//         const mailOptions = {
//             from: 'priyanshugupta.112002@gmail.com',
//             to: email,
//             subject: 'Librarian Credentials',
//             html: customizedTemplate
//         };

//         // Send email
//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return res.status(500).send(error.toString());
//             }
//             res.status(200).send('Email sent: ' + info.response);
//         });
//     });
// });


module.exports = Router;