import React, { useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import "../CssStyle/login.css";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hook/context/authContext";

export default function Login() {

  const navigate = useNavigate()
  const {login} = useAuth();
  const [credential, setCredential] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login with:", credential.email, credential.password);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email:credential.email, password:credential.password }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log("Login successful:", data);
      setCredential({email:"" , password:""});
      login(credential.email , data.token);
      navigate("/home")
      
      
    } catch (error) {
      console.error("There was an error during login:", error);
    }

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleEmailInput = (e)=>{
    const emailValue = e.target.value;
    setCredential((prev) => ({...prev , email:emailValue}))   // ispe try to use email in both value
  }

  const handlePasswordinput = (e)=>{
    const passwordValue = e.target.value;
    setCredential((prev) => ({...prev , password:passwordValue}));
  }

  const onForgotPasswordClick =()=>{
    Navigate('/')
  }

  const onRegitrationButtonClick =()=>{
    Navigate('/register')
  }

  return (
    <div className="login-container">
      {/* Welcome text */}
      <h2 className="login-title">Welcome</h2>

      <form onSubmit={handleSubmit} className="login-form">
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
            onChange={handlePasswordinput}
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

        {/* Forgot password link */}
        <div className="forgot-password-container">
          <NavLink to="/forgot-password">
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="forgot-password-link"
            >
              Forgot Password?
            </button>
          </NavLink>
        </div>

        {/* Login button */}
        <button type="submit" className="primary-button">
          Login
        </button>
      </form>

        {/* Registration section */}
        <div className="register-section">
          <p className="register-text">Have no account yet?</p>
          <NavLink to="/register">
            <button
              className="secondary-button">
              Registration
            </button>
          </NavLink>
        </div>
    </div>
  );
}
