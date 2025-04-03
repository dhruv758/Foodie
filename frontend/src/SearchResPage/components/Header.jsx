import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { searchDish } from '../api/zomatoApi'; // Adjust the path as needed
import { searchDish } from '@/HomePage/api/zomatoApi';
import locationIcon from '../../assets/location.png';
import userProfileIcon from '../../assets/userProfile.png';
import shoppingCartIcon from '../../assets/shopping-cart.png';

const Header = ({ cartCount = 0, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-green-600 mr-4">CVT</span>
          <div className="hidden sm:flex items-center text-gray-500">
            <img width="25" height="25" src={locationIcon} alt="marker" className="mr-2" />
            <span>NCR</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
          <span className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Home</span>
          <span className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Summary</span>
          <span className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Polls</span>
        </div>

        <div className="hidden sm:block">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4">
          <UserActions cartCount={cartCount} onCartClick={onCartClick} />
          
          <div className="sm:hidden">
            <button 
              onClick={toggleMenu}
              className="text-green-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-lg z-20">
          <div className="flex flex-col">
            <span className="px-4 py-2 border-b hover:bg-gray-100 cursor-pointer">Home</span>
            <span className="px-4 py-2 border-b hover:bg-gray-100 cursor-pointer">Summary</span>
            <span className="px-4 py-2 border-b hover:bg-gray-100 cursor-pointer">Polls</span>
          </div>
          
          <div className="p-4 space-y-4">
            <SearchBar isMobile={true} />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Location: NCR</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SearchBar = ({ isMobile = false }) => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearchClick = async (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const data = await searchDish(searchInput);
      navigate("/search", { state: { data } });
    }
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'w-72'}`}>
      <input
        type="text"
        placeholder="Search for Dish"
        className="border rounded-full px-4 py-2 pr-20 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button 
        className="absolute right-0 top-0 h-full rounded-full bg-yellow-500 hover:bg-yellow-600 text-white px-4"
        onClick={handleSearchClick}
      >
        Search
      </button>
    </div>
  );
};

const UserActions = ({ cartCount = 0, isMobile = false, onCartClick }) => {
  return (
    <div className={`flex items-center ${isMobile ? 'space-x-4' : 'space-x-3'}`}>
      <img 
        src={userProfileIcon} 
        alt="User Profile" 
        className={`cursor-pointer ${isMobile ? 'w-10 h-10' : 'w-8 h-8'}`} 
      />
      <div className="relative">
        <img 
          src={shoppingCartIcon} 
          alt="Cart" 
          className={`cursor-pointer ${isMobile ? 'w-10 h-10' : 'w-8 h-8'}`}
          onClick={onCartClick}
        />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
            {cartCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default Header;