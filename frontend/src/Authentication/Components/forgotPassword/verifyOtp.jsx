import React, { useState } from "react";


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
    <div className="flex flex-col items-center gap-4">
      {/* Check Email text */}
      <h2 className="text-2xl font-semibold">Check Your Mail</h2>

      <p className="text-lg">
        We sent a reset link to your {email}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        {/* OTP input */}
        <div className="w-80">
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ac073] focus:border-transparent"
            required
          />
        </div>

        {/* Confirm Code button */}
        <button type="submit" className="w-full cursor-pointer h-10 bg-[#1ac073] text-white rounded-lg hover:bg-[#1ac073]/90">
          Confirm Code
        </button>
    </form>

        {/* Resend confirmation code */}
        <button
          type="button"
          onClick={handleResendOtpClick}
          className="text-[#1ac073] cursor-pointer"
        >
          Resend Confirmation Code
        </button>
    </div>
  );
}
