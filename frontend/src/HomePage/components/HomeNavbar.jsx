import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiLogOut, FiMenu, FiX } from "react-icons/fi";
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const profileTimeoutRef = useRef(null);

  // Search handler
  const handleSearchClick = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const data = await searchDish(searchInput);
    const formattedText = searchInput.toLowerCase().replace(/\s+/g, '-');   
    navigate(`/search?name=${formattedText}`, { state: { data } });
    setMobileMenuOpen(false);
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

  // Profile dropdown hover handlers
  const handleProfileMouseEnter = () => {
    clearTimeout(profileTimeoutRef.current);
    setShowProfileDropdown(true);
  };

  const handleProfileMouseLeave = () => {
    profileTimeoutRef.current = setTimeout(() => {
      setShowProfileDropdown(false);
    }, 200);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
    <nav className="relative bg-white border-b border-gray-200">
      {/* Desktop and Tablet Navigation - For md and lg screens */}
      <div className="hidden md:flex items-center justify-between px-4 md:px-8 lg:px-12 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-6 md:mr-4 lg:mr-0">
          <img src={logo} className="w-32 md:w-36 lg:w-42 h-8 lg:h-10 object-contain" alt="Logo" />

          {/* Location Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={locationIcon} alt="Location" className="w-5 md:w-6 h-5 md:h-6" />
              <span className="text-base md:text-lg font-semibold">
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
                      className="p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors text-base md:text-lg"
                      onClick={() => setCurrentAddress(addr)}
                    >
                      {addr}
                    </p>
                  ))}
                </div>
                {!showInput ? (
                  <button
                    onClick={() => setShowInput(true)}
                    className="mt-2 w-full bg-[#1ac073] text-white py-1.5 rounded hover:bg-green-600 transition-colors text-base md:text-lg"
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
                      className="text-green-500 text-xl md:text-2xl cursor-pointer hover:text-green-600"
                      onClick={handleAddAddress}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Section - Navigation */}
        <div className="flex justify-between gap-6 md:gap-8 lg:gap-10 md:ml-4 lg:ml-0">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `text-base md:text-lg lg:text-xl font-semibold cursor-pointer hover:scale-110 ${
                isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/polls"
            className={({ isActive }) =>
              `text-base md:text-lg lg:text-xl font-semibold cursor-pointer hover:scale-110 ${
                isActive ? "text-[#1ac073]" : "hover:text-[#1ac073]"
              }`
            }
          >
            Polls
          </NavLink>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchClick} className="flex-1 max-w-[300px] md:max-w-[400px] lg:max-w-[500px] mx-2 md:mx-4 lg:mx-6 relative">
          <div className="relative">
            <FiSearch className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base md:text-lg lg:text-xl" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search for food"
              className="w-full h-8 md:h-9 lg:h-10 bg-gray-100 text-base md:text-lg font-medium rounded-full pl-8 md:pl-10 lg:pl-12 outline-none transition-all"
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-6 md:gap-8 lg:gap-12">
          {/* Cart */}
          <div className="relative">
            <img
              src={cartIcon}
              alt="Cart"
              className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 cursor-pointer hover:opacity-80 transition-opacity"
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

          {/* Profile with Dropdown */}
          <div 
            className="relative"
            onMouseEnter={handleProfileMouseEnter}
            onMouseLeave={handleProfileMouseLeave}
          >
            <img
              src={profileIcon}
              alt="Profile"
              className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 cursor-pointer hover:opacity-80 transition-opacity"
            />
            {showProfileDropdown && (
              <div className="absolute top-8 md:top-9 lg:top-10 right-0 mt-1 bg-white shadow-lg rounded-lg p-2 w-40 z-20">
                <div 
                  className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                  onClick={handleLogout}
                >
                  <FiLogOut className="text-gray-500" />
                  <span className="font-medium">Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Only for sm screens */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <img src={logo} className="h-8 object-contain" alt="Logo" />
        </div>

        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <div className="relative">
            <img
              src={cartIcon}
              alt="Cart"
              className="w-7 h-7 cursor-pointer"
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

          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-700 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Only for sm screens */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute w-full z-50 shadow-lg">
          {/* Search Bar */}
          <form onSubmit={handleSearchClick} className="px-4 py-3 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                placeholder="Search for food"
                className="w-full h-10 bg-gray-100 rounded-full pl-10 pr-4 outline-none"
              />
            </div>
          </form>

          {/* Location */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <img src={locationIcon} alt="Location" className="w-5 h-5" />
              <span className="font-medium">{currentAddress}</span>
            </div>
            <div className="mt-2">
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
              >
                {addresses.map((addr, index) => (
                  <option key={index} value={addr}>{addr}</option>
                ))}
              </select>
              {!showInput ? (
                <button
                  onClick={() => setShowInput(true)}
                  className="mt-2 w-full bg-[#1ac073] text-white py-1.5 rounded"
                >
                  Add Address
                </button>
              ) : (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded outline-none"
                    placeholder="New address"
                    autoFocus
                  />
                  <button
                    className="bg-[#1ac073] text-white p-2 rounded"
                    onClick={handleAddAddress}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-2">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `block py-3 text-lg font-medium ${
                  isActive ? "text-[#1ac073]" : "text-gray-800"
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/polls"
                className={({ isActive }) =>
                  `block py-3 text-lg font-medium ${
                    isActive ? "text-[#1ac073]" : "text-gray-800"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Polls
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-3 text-lg font-medium text-gray-800 w-full"
              >
                <FiLogOut className="text-gray-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  }
  
  export default HomeNavbar;
  
