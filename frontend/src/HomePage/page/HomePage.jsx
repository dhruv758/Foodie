import React, { useState } from "react";
import HomeNavbar from "../components/HomeNavbar";
import chef from "../../assets/chef.png";
import FoodSelection from "../components/FoodSelection";
import { useNavigate } from "react-router-dom";
import { searchDish } from "../api/zomatoApi";

const HomePage = () => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");

  const handleSearchClick = async (e) => {
    e.preventDefault();
    console.log(searchInput);

    const data = await searchDish(searchInput);
    navigate("/search", { state: { data } });
  };

  return (
    <>
      <HomeNavbar />
      <section className="mid-section">
        <div className="bg-[#1AC073] partition py-6 rounded-bl-4xl rounded-br-4xl flex items-center justify-around">
          <div className="paragraph">
            <h1 className="text-4xl font-medium pb-4">Let's Order Some Food</h1>

            <form
              onSubmit={handleSearchClick}
              className="search w-[620px] h-[68px]"
            >
              <input
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                type="text"
                placeholder="Search for dish"
                className="bg-[#ecf0e9] outline-none text-xl pl-6  w-[440px] h-[68px] rounded-tl-xl rounded-bl-xl"
              />
              <button
                type="submit"
                className="text-white bg-[#f3ba00] w-[180px] h-[68px] text-xl rounded-tr-xl rounded-br-xl cursor-pointer"
              >
                Search
              </button>
            </form>
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
