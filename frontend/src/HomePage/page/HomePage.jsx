import React from 'react'
import HomeNavbar from '../components/HomeNavbar';
import chef from "../../assets/chef.png";
import FoodSelection from '../components/FoodSelection';

function HomePage() {
  return (
    <>
    <HomeNavbar />
    <section className="mid-section">
      <div className="bg-[#1AC073] partition flex items-center justify-around">
        <div className="paragraph">
          <h1 className="text-4xl pb-4">Let's Order Some Food</h1>
          <div className="search w-[620px] h-[68px]">
            <input type="text" placeholder="Search for dish" className="bg-[#ecf0e9] outline-none text-xl pl-6  w-[440px] h-[68px] rounded-tl-xl rounded-bl-xl" />
            <button className="text-white bg-[#f3ba00] w-[180px] h-[68px] text-xl rounded-tr-xl rounded-br-xl cursor-pointer">Search</button>
          </div>
        </div>
        <div className="image">
<img src={chef} alt="" className="w-[600px] h-[550px]" />
        </div>


      </div>
      </section>
     <FoodSelection />
    </>
  )
}

export default HomePage