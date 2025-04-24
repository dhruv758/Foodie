import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import logo from "../../assets/logo.svg";

const SignInForm = () => {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row justify-center md:justify-around items-center">
      {/* Left side with logo - hidden on small screens */}
      <div className="hidden sm:flex flex-col gap-6 items-center mb-8 md:mb-0">
        <img src={logo || "/placeholder.svg"} alt="CVT Logo" className="" />
        <h1 className="text-2xl font-semibold">Work Hard, Eat Harder</h1>
      </div>

      {/* Right side with authentication forms */}
      <div className="w-full sm:w-auto px-4">
        <div className="max-w-md mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
