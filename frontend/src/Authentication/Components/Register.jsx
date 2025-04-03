import React, { useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { NavLink, useNavigate } from "react-router-dom";
import "../CssStyle/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [credential, setCredential] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailInput = (e) => {
    setCredential((prev) => ({ ...prev, email: e.target.value }));
  };

  const handlePasswordInput = (e) => {
    setCredential((prev) => ({ ...prev, password: e.target.value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credential.password !== credential.confirmPassword) {
      toast.error("Passwords do not match!", { autoClose: 3000 });
      return;
    }

    toast.info("⏳ request send to admin fro approval...", { autoClose: 7000 });

    try {
      const response = await fetch("http://localhost:3000/register-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: credential.email, password: credential.password }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message, { autoClose: 3000 });
        throw new Error("Network response was not ok");
      }

      // Clear input fields
      setCredential({ email: "", password: "", confirmPassword: "" });

      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
      
    }
  };

  return (
    <div className="register-container">
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      
      <h2 className="register-title">Register</h2>

      <form onSubmit={handleSubmit} className="register-form">
        {/* Email input */}
        <div className="input-container">
          <div className="input-icon">
            <EnvelopeIcon className="icon" />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={credential.email}
            onChange={handleEmailInput}
            className="auth-input"
            required
          />
        </div>

        {/* Password input */}
        <div className="input-container">
          <div className="input-icon">
            <LockClosedIcon className="icon" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={credential.password}
            onChange={handlePasswordInput}
            className="auth-input"
            required
          />
          <button type="button" onClick={togglePasswordVisibility} className="password-toggle">
            {showPassword ? <EyeSlashIcon className="icon" /> : <EyeIcon className="icon" />}
          </button>
        </div>

        {/* Confirm Password input */}
        <div className="input-container">
          <div className="input-icon">
            <LockClosedIcon className="icon" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={credential.confirmPassword}
            onChange={(e) => setCredential((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className="auth-input"
            required
          />
          <button type="button" onClick={toggleConfirmPasswordVisibility} className="password-toggle">
            {showConfirmPassword ? <EyeSlashIcon className="icon" /> : <EyeIcon className="icon" />}
          </button>
        </div>

        {/* Register button */}
        <button className="primary-button">Register</button>
      </form>

      {/* Login section */}
      <div className="login-section">
        <p className="login-text">Already have an account?</p>
        <NavLink to="/">
          <button className="secondary-button">Sign In</button>
        </NavLink>
      </div>
    </div>
  );
}
