import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiPlus, FiSearch } from "react-icons/fi";
import logo from "../../assets/logo.png";
import locationIcon from "../../assets/location.svg";
import cartIcon from "../../assets/shopping-cart.png";
import profileIcon from "../../assets/profile.svg";
import CartPopup from "../../foodieCart/components/CartPopup";
import { useCart } from "../../foodieCart/Context/CartContext";
import { searchDish } from "../api/zomatoApi";

function HomeNavbar() {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [addresses, setAddresses] = useState(["Sector-62"]);
  const [currentAddress, setCurrentAddress] = useState("Sector-62");
  const [newAddress, setNewAddress] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const timeoutRef = useRef(null);

  // Search handler
  const handleSearchClick = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const data = await searchDish(searchInput);
    const formattedText = searchInput.toLowerCase().replace(/\s+/g, '-');   
    navigate(`/search?name=${formattedText}`, { state: { data } });
  };

  // Add new address
  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setAddresses((prev) => [...prev, newAddress]);
      setCurrentAddress(newAddress);
      setNewAddress("");
      setShowInput(false);
    }
  };

  // Handle Enter key for address input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleAddAddress();
  };

  // Toggle cart popup
  const toggleCartPopup = () => setShowCartPopup((prev) => !prev);

  // Dropdown hover handlers
  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (!showInput) setShowDropdown(false);
    }, 200);
  };

  // Truncate address to exactly 10 characters with ellipsis
  const truncateAddress = (address) => {
    const maxLength = 10;
    if (address.length > maxLength) {
      return `${address.slice(0, maxLength)}...`;
    }
    return address;
  };

  return (
    <nav className="flex items-center justify-between px-12 py-4 bg-white border-b border-gray-200">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <img src={logo} className="w-42 h-10 object-contain" alt="Logo" />

        {/* Location Dropdown */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={locationIcon} alt="Location" className="w-6 h-6" />
            <span className="text-lg font-semibold">
              {truncateAddress(currentAddress)}
            </span>
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-10 left-0 mt-1 bg-white shadow-lg rounded-lg p-3 w-60 z-20">
              <div className="max-h-36 overflow-y-auto scrollbar-thin">
                {addresses.map((addr, index) => (
                  <p
                    key={index}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors text-lg"
                    onClick={() => setCurrentAddress(addr)}
                  >
                    {addr}
                  </p>
                ))}
              </div>
              {!showInput ? (
                <button
                  onClick={() => setShowInput(true)}
                  className="mt-2 w-full bg-[#1ac073] text-white py-1.5 rounded hover:bg-green-600 transition-colors text-lg"
                >
                  Add Address
                </button>
              ) : (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full border border-gray-300 p-2 rounded outline-none"
                    placeholder="New address"
                    autoFocus
                    onBlur={() => !newAddress.trim() && setShowInput(false)}
                  />
                  <FiPlus
                    className="text-green-500 text-2xl cursor-pointer hover:text-green-600"
                    onClick={handleAddAddress}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center Section - Navigation */}
      <div className="flex justify-between gap-10">
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

      {/* Search Bar */}
      <form onSubmit={handleSearchClick} className="flex-1 max-w-[500px] mx-6 relative">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search for food"
            className="w-full h-10 bg-gray-100 text-lg font-medium rounded-full pl-12 outline-none transition-all"
          />
        </div>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-12">
        {/* Cart */}
        <div className="relative">
          <img
            src={cartIcon}
            alt="Cart"
            className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleCartPopup}
          />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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

        {/* Profile */}
        <button>
          <img
            src={profileIcon}
            alt="Profile"
            className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          />  
        </button>
      </div>
    </nav>
  );
}

export default HomeNavbar;