import React, { useState } from "react";
import "../../CssStyle/CheckEmail.css";

export default function VerifyOtp({email , onForgotButtonClick}) {
  const [otp, setOtp] = useState("");




const handleSubmit = async(e) => {
    e.preventDefault();
    if (email.trim() === "") {
      return;
    }
    
    try {
        const response = await fetch("http://localhost:3000/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email , otp}),
        });
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        const data = await response.json();
        console.log("otp verified successful:", data);
        onForgotButtonClick();
      } catch (error) {
        console.error("There was an error during login:", error);
    }

    console.log("Reset password for:", email);
    setEmailid(email);
    onForgotButtonClick(); // Move to the next screen

  };
  const handleResendOtpClick = async()=>{
    
    try {
        const response = await fetch("http://localhost:3000/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email}),
        });
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        const data = await response.json();
        console.log("Login successful:", data);
      } catch (error) {
        console.error("There was an error during login:", error);
    }


  }


  return (
    <div className="check-email-container">
      {/* Check Email text */}
      <h2 className="check-email-title">Check Your Mail</h2>

      <p className="check-email-subtitle">
        We sent a reset link to your {email}
      </p>

      <form onSubmit={handleSubmit} className="check-email-form">
        {/* OTP input */}
        <div className="otp-container">
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input"
            required
          />
        </div>

        {/* Confirm Code button */}
        <button type="submit" className="primary-button">
          Confirm Code
        </button>
    </form>

        {/* Resend confirmation code */}
        <button
          type="button"
          onClick={handleResendOtpClick}
          className="resend-code-button"
        >
          Resend Confirmation Code
        </button>
    </div>
  );
}
