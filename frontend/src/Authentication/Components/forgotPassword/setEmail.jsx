import React, { useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function SetEmail({ setEmailid, onForgotButtonClick }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
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
        body: JSON.stringify({ email }),
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
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-medium">Forgot Your Password?</h2>
      <p className="">Enter your registered email</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ac073] focus:border-transparent"
            required
          />
        </div>
        <button className="w-full cursor-pointer h-10 bg-[#1ac073] text-white rounded-lg hover:bg-[#1ac073]/90">
          Confirm Mail
        </button>
      </form>
    </div>
  );
}
