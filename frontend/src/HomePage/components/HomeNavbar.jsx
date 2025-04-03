// src/components/HomeNavbar.jsx
import React, { useState } from "react";
import logo from "../../assets/logo.png";
import location from "../../assets/location.svg";
import list from "../../assets/list.svg";
import profile from "../../assets/profile.svg";
import { NavLink } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import CartPopup from '../../foodieCart/components/CartPopup'; 
import { useCart } from "../../foodieCart/Context/CartContext"; 

function HomeNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [addresses, setAddresses] = useState(["Sector-62"]);
  const [currentAddress, setCurrentAddress] = useState("Sector-62");
  const [newAddress, setNewAddress] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const { cartItems, setCartItems } = useCart();

  const handleAddAddress = () => {
    if (newAddress.trim() !== "") {
      setAddresses([...addresses, newAddress]);
      setCurrentAddress(newAddress);
      setNewAddress("");
      setShowInput(false);
    }
  };

  const toggleCartPopup = () => {
    setShowCartPopup(!showCartPopup);
  };

  return (
    <div className="outer flex justify-between px-16 pb-2 relative">
      {/* Left Section */}
      <div className="left flex items-center gap-10">
        <img src={logo} className="w-48 h-10 mt-2" />
        <div
          className="location relative flex items-center cursor-pointer"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <img src={location} alt="Location" className="w-[35px] h-[35px]" />
          <h1 className="text-lg font-semibold">{currentAddress}</h1>
          {showDropdown && (
            <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg p-4 w-56">
              <div className="max-h-40 overflow-y-auto">
                {addresses.map((addr, index) => (
                  <p
                    key={index}
                    className="cursor-pointer p-1 hover:bg-gray-200 rounded"
                    onClick={() => setCurrentAddress(addr)}
                  >
                    {addr}
                  </p>
                ))}
              </div>
              {!showInput && (
                <button
                  onClick={() => setShowInput(true)}
                  className="bg-[#1ac073] text-white mt-2 px-4 py-1 rounded w-full"
                >
                  Add Address
                </button>
              )}
              {showInput && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="border border-gray-300 p-1 w-full rounded"
                    autoFocus
                  />
                  <FiPlus
                    className="text-[#1ac073] cursor-pointer text-2xl"
                    onClick={handleAddAddress}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center Section - Navigation Links */}
      <div className="center flex gap-10 items-center">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `text-xl font-semibold cursor-pointer hover:scale-110 ${
              isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `text-xl font-semibold cursor-pointer hover:scale-110 ${
              isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
            }`
          }
        >
          Summary
        </NavLink>
        <NavLink
          to="/polls"
          className={({ isActive }) =>
            `text-xl font-semibold cursor-pointer hover:scale-110 ${
              isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
            }`
          }
        >
          Polls
        </NavLink>
      </div>

      {/* Right Section */}
      <div className="right flex gap-10 items-center">
        <div className="relative">
          <img
            src={list}
            alt="Cart"
            className="w-[35px] h-[35px] cursor-pointer"
            onClick={toggleCartPopup}
          />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
          {showCartPopup && (
            <CartPopup
              cartItems={cartItems}
              setCartItems={setCartItems}
              onClose={toggleCartPopup}
            />
          )}
        </div>
        <img src={profile} alt="Profile" className="w-[35px] h-[35px] cursor-pointer" />
      </div>
    </div>
  );
}

export default HomeNavbar;