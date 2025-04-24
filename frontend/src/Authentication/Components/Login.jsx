import React, { useEffect, useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hook/context/authContext";
import logo from "../../assets/logo.png";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credential, setCredential] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(()=>{
    const isAuthenticated = localStorage.getItem('auth');
    
    if(isAuthenticated){
      navigate("/home")
    }
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login with:", credential.email, credential.password);

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credential.email,
          password: credential.password,
        }),
      });

      if (!response.ok) {
        toast.error("Invalid Credentail")
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      setCredential({ email: "", password: "" });
      login(credential.email, data.token);
      navigate("/home");
    } catch (error) {
      console.error("There was an error during login:", error);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailInput = (e) => {
    const emailValue = e.target.value;
    setCredential((prev) => ({ ...prev, email: emailValue }));
  };

  const handlePasswordinput = (e) => {
    const passwordValue = e.target.value;
    setCredential((prev) => ({ ...prev, password: passwordValue }));
  };

  return (
    <div className="flex flex-col items-center w-full">
      <ToastContainer />
      {/* Logo only visible on small screens since it's hidden in parent component */}
      <div className="sm:hidden mb-6">
        <img src={logo} alt="" className="h-10 w-48" />
      </div>
      
      {/* Welcome text */}
      <h2 className="text-2xl font-semibold mb-8">Welcome</h2>

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
          </button>
        </div>

        {/* Forgot password link */}
        <div className="w-full text-right">
          <NavLink to="/forgot-password">
            <button
              type="button"
              className="text-[#1ac073] cursor-pointer text-sm"
            >
              Forgot Password?
            </button>
          </NavLink>
        </div>

        {/* Login button */}
        <button
          type="submit"
          className="w-full cursor-pointer h-10 bg-[#1ac073] text-white rounded-lg hover:bg-[#1ac073]/90"
        >
          Login
        </button>
      </form>

      {/* Registration section */}
      <div className="mt-4 w-full text-center px-4 sm:px-0">
        <p className="text-sm">Have no account yet?</p>
        <NavLink to="/register">
          <button className="w-full cursor-pointer h-10 mt-2 border border-[#1ac073] text-[#1ac073] rounded-lg hover:bg-green-50">
            Registration
          </button>
        </NavLink>
      </div>
    </div>
  );
}
