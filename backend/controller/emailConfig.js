const fs = require('fs').promises;
const path = require('path');
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
        from: 'process.env.email',
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

  async function sendAuthorityEmail(email) {

        const templatePath = path.join(__dirname, '..', 'emailTemplate', 'emailTemp.html');
          console.log(templatePath)
        let emailTemplate;

        try {
          emailTemplate = await fs.readFile(templatePath, "utf8");
        } catch (err) {
          console.error("Error reading email template:", err);
          return res.status(500).json({ message: "Error reading email template" });
        }


        // Replace placeholders in email template
        const customizedTemplate = emailTemplate
        .replace("{{email}}", email)
        .replace("{{acceptUrl}}",  `${process.env.FRONTEND_URL}/approve-accept?user=${encodeURIComponent(email)}`)
        .replace("{{rejectUrl}}", `${process.env.FRONTEND_URL}/approve-reject?user=${encodeURIComponent(email)}`);

          // Create email options
          const mailOptions = {
            from:process.env.email,
            to: process.env.authEmail,
            subject: "Request for Approval: New User Registration for Foodie App",
            html: customizedTemplate,
          };


          // Send email before saving user
          try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent:", info.response);

            return ;

          } catch (emailError) {
            console.error("Error sending email:", emailError);
            throw new Error(`Error sending authority email: ${error.message}`);
          }

  }

  async function sendConfirmationEmail(email) {

    const templatePath = path.join(__dirname, '..', 'emailTemplate', 'confirmationMail.html');
    console.log(templatePath)
    let emailTemplate;

    try {
      emailTemplate = await fs.readFile(templatePath, "utf8");
    } catch (err) {
      console.error("Error reading email template:", err);
      return res.status(500).json({ message: "Error reading email template" });
    }


    // Replace placeholders in email template
    const customizedTemplate = emailTemplate.replace("{{email}}", email);


      // Create email options
      const mailOptions = {
        from:process.env.email,
        to: email,
        subject: "Permission for a new user wants to register",
        html: customizedTemplate,
      };


      // Send email before saving user
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        return ;

      } catch (emailError) {
        console.error("Error sending email:", emailError);
        throw new Error(`Error sending authority email: ${error.message}`);
      }

}
  

async function sendRejectionEmail(email) {

  const templatePath = path.join(__dirname, '..', 'emailTemplate', 'RejectMail.html');
  console.log(templatePath)
  let emailTemplate;

  try {
    emailTemplate = await fs.readFile(templatePath, "utf8");
  } catch (err) {
    console.error("Error reading email template:", err);
    return res.status(500).json({ message: "Error reading email template" });
  }


  // Replace placeholders in email template
  const customizedTemplate = emailTemplate.replace("{{email}}", email);


    // Create email options
    const mailOptions = {
      from:process.env.email,
      to: email,
      subject: "Permission for a new user wants to register",
      html: customizedTemplate,
    };


    // Send email before saving user
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);

      return ;

    } catch (emailError) {
      console.error("Error sending email:", emailError);
      throw new Error(`Error sending authority email: ${error.message}`);
    }

}


  module.exports = { sendOTPEmail , sendAuthorityEmail  , sendConfirmationEmail , sendRejectionEmail};


