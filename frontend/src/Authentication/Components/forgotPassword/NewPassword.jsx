import React, { useState } from "react";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function NewPassword({ email }) {
  const navigate = useNavigate();

  const [password, setPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(password.password, email);
    try {
      const response = await fetch("http://localhost:3000/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword: password.password }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Login successful:", data);
    } catch (error) {
      console.error("There was an error during login:", error);
    }
    navigate("/");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Set New Password text */}
      <h2 className="text-2xl font-semibold">Set a New Password</h2>

      <p className="text-lg">Create a new password</p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-80">
        {/* Password input */}

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password.password}
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full h-10 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ac073] focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Confirm Password input */}

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Your Password"
            value={password.confirmPassword}
            onChange={(e) =>
              setPassword((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className="w-full h-10 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ac073] focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Confirm Password button */}
        <button className="w-full cursor-pointer h-10 bg-[#1ac073] text-white rounded-lg hover:bg-[#1ac073]/90">
          Confirm Password
        </button>
      </form>
    </div>
  );
}
