import React, { useState } from "react";

export default function CheckEmail({ email, onConfirmCodeClick }) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Verifying OTP:", otp);
    onConfirmCodeClick();
  };

  const handleResendCode = () => {
    console.log("Resending code to:", email);
  };

  return (
    <div className="flex flex-col w-full items-center">
      {/* Check Email text */}
      <h2 className="font-semibold text-2xl mb-4 text-center">Check Your Mail</h2>

      {/* Subtitle with email */}
      <p className="font-normal text-sm mb-8 text-center">
        We sent a reset link to your ({email})
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full items-center">
        {/* OTP input */}
        <div className="w-full">
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-[358px] h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Confirm Code button */}
        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
          Confirm Code
        </button>

        {/* Resend confirmation code */}
        <button
          type="button"
          onClick={handleResendCode}
          className="w-[258px] h-[30px] text-green-500 text-sm text-center"
        >
          Resend Confirmation Code
        </button>
      </form>
    </div>
  );
}
