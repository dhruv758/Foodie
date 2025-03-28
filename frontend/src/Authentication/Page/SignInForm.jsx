import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import logo from "../../assets/logo.svg";
import "../CssStyle/AuthLayout.css";

const SignInForm = () => {
  return (
    <div className="auth-container">
      {/* Left side with logo */}
      <div className="auth-left-panel">
        <img src={logo || "/placeholder.svg"} alt="CVT Logo" className="auth-logo" />
        <h1 className="auth-welcome-text">Welcome to CVT</h1>
      </div>

      {/* Right side with authentication forms */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SignInForm;