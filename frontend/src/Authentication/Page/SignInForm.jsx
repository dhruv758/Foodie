import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import logo from "../../assets/logo.svg";


const SignInForm = () => {
  return (
    <div className="flex h-screen w-full justify-around items-center">
      {/* Left side with logo */}
      <div className="flex flex-col gap-6 items-center">
        <img src={logo || "/placeholder.svg"} alt="CVT Logo" className="" />
        <h1 className="text-2xl font-semibold">Work Hard, Eat Harder</h1>
      </div>

      {/* Right side with authentication forms */}
      <div className="">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SignInForm;