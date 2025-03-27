import React, { useState } from "react";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import "../../CssStyle/SetNewPassword.css";
import { useNavigate } from "react-router-dom";



export default function NewPassword({ email}) {

    const navigate = useNavigate();

  const [password, setPassword] = useState({
    password:"", confirmPassword:""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(password.password , email)
    try {
        const response = await fetch("http://localhost:3000/update-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email , newPassword:password.password }),
        });
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        const data = await response.json();
        console.log("Login successful:", data);
      } catch (error) {
        console.error("There was an error during login:", error);
    }
    navigate('/')
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };



  return (
    <div className="set-password-container">
      {/* Set New Password text */}
      <h2 className="set-password-title">Set a New Password</h2>

      <p className="set-password-subtitle">Create a new password</p>

      <form onSubmit={handleSubmit} className="set-password-form">
        {/* Password input */}
        <div className="input-container">
          <div className="input-icon">
            <LockClosedIcon className="icon" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password.password}
            onChange={(e) => setPassword((prev)=>({...prev , password:e.target.value}))}
            className="auth-input"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle"
          >
            {showPassword ? (
              <EyeSlashIcon className="icon" />
            ) : (
              <EyeIcon className="icon" />
            )}
          </button>
        </div>

        {/* Confirm Password input */}
        <div className="input-container">
          <div className="input-icon">
            <LockClosedIcon className="icon" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Your Password"
            value={password.confirmPassword}
            onChange={(e) => setPassword((prev)=>({...prev , confirmPassword:e.target.value}))}
            className="auth-input"
            required
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="password-toggle"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="icon" />
            ) : (
              <EyeIcon className="icon" />
            )}
          </button>
        </div>

        {/* Confirm Password button */}
        <button  className="primary-button">
          Confirm Password
        </button>
      </form>
    </div>
  );
}
