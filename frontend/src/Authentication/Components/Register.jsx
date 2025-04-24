import React, { useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { toast, ToastContainer } from "react-toastify";

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
    setCredential((prev) => ({ ...prev, email: emailValue }));
  };
  
  const handlePasswordinput = (e) => {
    const passwordValue = e.target.value;
    setCredential((prev) => ({ ...prev, password: passwordValue }));
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const emailCheck = (email) => {
    let isValid = true;
  
    // Rule 1: No spaces allowed
    if (/\s/.test(email)) {
      console.error("❌ Email must not contain spaces.");
      isValid = false;
    }
  
    // Rule 2: Must start with a letter or digit
    if (email && !/^[a-zA-Z0-9]/.test(email)) {
      console.error("❌ Email must start with a letter or digit.");
      isValid = false;
    }
  
    // Rule 3: Must end with a valid domain
    const allowedDomains = ['@corevaluetech.com', '@concirus.com'];
    const isValidDomain = allowedDomains.some((domain) =>
      email.toLowerCase().endsWith(domain)
    );
  
    if (email && !isValidDomain) {
      console.error("❌ Email must end with @corevaluetech.com or @concirus.com.");
      isValid = false;
    }
  
    return isValid;
  };

  const passwordCheck = (password) => {
    let isValid = true;
  
    // Rule 1: Minimum length of 5
    if (password.length < 5) {
      console.error("❌ Password must be at least 5 characters long.");
      isValid = false;
    }
  
    // Rule 2: No spaces allowed
    if (/\s/.test(password)) {
      console.error("❌ Password must not contain spaces.");
      isValid = false;
    }
  
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!emailCheck || !passwordCheck){
        toast.error("Improper cred")
        return
    }

    if (credential.password !== credential.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const check1 = emailCheck(credential.email);
    const check2 = passwordCheck(credential.password)

    if(!check1 ){
      toast.error("email is not valid for register")
      return
    }
    if(!check2 ){
      toast.error("password is not valid for register")
      return
    }

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
    }
  };
  
  return (
    <div className="flex flex-col w-full items-center">
      <ToastContainer />
      {/* Logo only visible on small screens since it's hidden in parent component */}
      <div className="sm:hidden mb-6">
        <img src={logo} alt="" className="h-10 w-48" />
      </div>
      
      {/* Register title */}
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full sm:w-80 max-w-md px-4 sm:px-0"
      >
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
            className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1AC073] focus:border-transparent"
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
            className="w-full h-10 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1AC073] focus:border-transparent"
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
            placeholder="Confirm Password"
            value={credential.confirmPassword}
            onChange={(e) =>
              setCredential((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className="w-full h-10 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1AC073] focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
                       {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {/* Register button */}
        <button
          type="submit"
          className="bg-[#1AC073] text-white py-2 cursor-pointer rounded-lg hover:bg-[#1AC073]/90"
        >
          Register
        </button>
      </form>
      {/* Login section */}
      <div className="mt-4 w-full text-center px-4 sm:px-0">
        <p className="text-sm">Already have an account?</p>
        <NavLink to="/">
          <button className="w-full cursor-pointer h-10 mt-2 border border-[#1AC073] text-[#1AC073] rounded-lg hover:bg-green-50">
            Login
          </button>
        </NavLink>
      </div>
    </div>
  );
}
