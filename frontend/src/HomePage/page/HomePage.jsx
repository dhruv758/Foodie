// src/components/HomePage.jsx
import React, { useState } from "react";
import HomeNavbar from "../components/HomeNavbar";
import chef from "../../assets/chef.png";
import FoodSelection from "../components/FoodSelection";

const HomePage = () => {
  return (
    <>
      <HomeNavbar />
      <section className="mid-section">
        <div className="bg-[#1AC073] partition py-6 rounded-bl-4xl rounded-br-4xl flex flex-col md:flex-row items-center justify-around">
          <div className="paragraph">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium pb-4 text-center">
              Turning <span className="text-gray-200">Deadlines</span> into <span className="text-gray-200">Meal Times</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white text-center">
              Because the only 'meeting' we never cancel is with food!
            </p>
          </div>
          <div className="image mt-6 md:mt-0">
            <img 
              src={chef} 
              alt="" 
              className="w-[250px] h-[225px] sm:w-[350px] sm:h-[315px] md:w-[400px] md:h-[300px] lg:w-[500px] lg:h-[450px]" 
            />
          </div>
        </div>
      </section>
      <FoodSelection />
    </>
  );
};

export default HomePage;
