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
        <div className="bg-[#1AC073] partition py-6 rounded-bl-4xl rounded-br-4xl flex items-center justify-around">
          <div className="paragraph">
            <h1 className="text-4xl font-medium pb-4">Let's Order Some Food</h1>
            
            
          </div>
          <div className="image">
            <img src={chef} alt="" className="w-[600px] h-[550px]" />
          </div>
        </div>
      </section>
      <FoodSelection />
    </>
  );
};

export default HomePage;