import React, { useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import "../CssStyle/Register.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function Register({ onLoginClick }) {


  const navigate = useNavigate();

  const[credential , setCredential] = useState({
    email:"",
    password:"",
    confirmPassword:""
  })
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
  const handleEmailInput = (e)=>{
    const emailValue = e.target.value;
    setCredential((prev) => ({...prev , email:emailValue}))   // ispe try to use email in both value
  }
  
  const handlePasswordinput = (e)=>{
    const passwordValue = e.target.value;
    setCredential((prev) => ({...prev , password:passwordValue}));
  }
  
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };




  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Register with:", credential.email, credential.password, credential.confirmPassword);
    
    if(credential.password != credential.confirmPassword){
      console.log("password is not same")
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
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
      setCredential({email:"", password:"", confirmPassword:""})
      navigate("/");
      
    } catch (error) {
      console.error("There was an error during login:", error);
    }
  };

  return (
    <div className="register-container">
      {/* Register text */}
      <h2 className="register-title">Register</h2>

      <form  onSubmit={handleSubmit} className="register-form">
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

        {/* Confirm Password input */}
        <div className="input-container">
          <div className="input-icon">
            <LockClosedIcon className="icon" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={credential.confirmPassword}
            onChange={(e) => setCredential((prev) =>({...prev , confirmPassword:e.target.value}))}
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

          {/* Register button */}
          <button className="primary-button">
            Register
          </button>
      </form>

        {/* Login section */}
        <div className="login-section">
          <p className="login-text">Already have an account?</p>
          <NavLink to ="/">
            <button
              className="secondary-button"
              >
              Sign In
            </button>
          </NavLink>
        </div>
    </div>
  );
}
