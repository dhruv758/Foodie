import React, { useState } from "react";
import "../CssStyle/CheckEmail.css";

export default function CheckEmail({ email, onConfirmCodeClick }) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle OTP verification logic here
    console.log("Verifying OTP:", otp);
    onConfirmCodeClick();
  };

  const handleResendCode = () => {
    // Handle resend code logic here
    console.log("Resending code to:", email);
  };

  return (
    <div className="check-email-container">
      {/* Check Email text */}
      <h2 className="check-email-title">Check Your Mail</h2>

      <p className="check-email-subtitle">
        We sent a reset link to your ({email})
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

        {/* Resend confirmation code */}
        <button
          type="button"
          onClick={handleResendCode}
          className="resend-code-button"
        >
          Resend Confirmation Code
        </button>
      </form>
    </div>
  );
}
