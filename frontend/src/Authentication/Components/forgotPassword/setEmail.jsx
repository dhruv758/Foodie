import React, { useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import "../../CssStyle/ForgotPassword.css";

export default function SetEmail({ setEmailid, onForgotButtonClick }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (email.trim() === "") {
      return;
    }
    
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

    console.log("Reset password for:", email);
    setEmailid(email);
    onForgotButtonClick(); // Move to the next screen

  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Forgot Your Password</h2>
      <p className="forgot-password-subtitle">
        Enter your email for forgetting password
      </p>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        <div className="input-container">
          <div className="input-icon">
            <EnvelopeIcon className="icon" />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
        </div>
        <button className="primary-button" >Confirm Mail</button>
      </form>
    </div>
  );
}
