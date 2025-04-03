import React, { useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Register({ onLoginClick }) {

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

    const emailValue = e.target.value;
    setCredential((prev) => ({ ...prev, email: emailValue })); // ispe try to use email in both value
  };

  const handlePasswordinput = (e) => {
    const passwordValue = e.target.value;
    setCredential((prev) => ({ ...prev, password: passwordValue }));

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

    console.log(
      "Register with:",
      credential.email,
      credential.password,
      credential.confirmPassword
    );

    if (credential.password !== credential.confirmPassword) {
      console.log("Passwords do not match");


    if (credential.password !== credential.confirmPassword) {
      toast.error("Passwords do not match!", { autoClose: 3000 });

      return;
    }

    toast.info("⏳ request send to admin fro approval...", { autoClose: 7000 });

    try {
      const response = await fetch("http://localhost:3000/register-verify", {
        method: "POST",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credential.email,
          password: credential.password,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log("Registration successful:", data);
      setCredential({ email: "", password: "", confirmPassword: "" });
      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);

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

    <div className="flex flex-col w-full items-center">
      <img src={logo} alt="" className="h-10 w-48 mb-6" />
      {/* Register title */}
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80 max-w-md"
      >

    <div className="register-container">
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      
      <h2 className="register-title">Register</h2>

      <form onSubmit={handleSubmit} className="register-form">

        {/* Email input */}

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={credential.email}
            onChange={handleEmailInput}
            className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ac073] focus:border-transparent"
            required
          />
        </div>

        {/* Password input */}

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={credential.password}

            onChange={handlePasswordinput}
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

            onChange={handlePasswordInput}
            className="auth-input"
            required
          />
          <button type="button" onClick={togglePasswordVisibility} className="password-toggle">
            {showPassword ? <EyeSlashIcon className="icon" /> : <EyeIcon className="icon" />}

          </button>
        </div>

        {/* Confirm Password input */}

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={credential.confirmPassword}

            onChange={(e) =>
              setCredential((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
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

            onChange={(e) => setCredential((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className="auth-input"
            required
          />
          <button type="button" onClick={toggleConfirmPasswordVisibility} className="password-toggle">
            {showConfirmPassword ? <EyeSlashIcon className="icon" /> : <EyeIcon className="icon" />}

          </button>
        </div>

        {/* Register button */}

        <button
          type="submit"
          className="bg-[#1ac073] text-white py-2 cursor-pointer rounded-lg hover:bg-[#1ac073]/90"
        >
          Register
        </button>
      </form>

      {/* Login section */}
      <div className="mt-4 w-full text-center">
        <p className="text-sm">Already have an account?</p>
        <NavLink to="/">
          <button className="w-full cursor-pointer h-10 mt-2 border border-[#1ac073] text-[#1ac073] rounded-lg hover:bg-green-50">
            Login
          </button>

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
