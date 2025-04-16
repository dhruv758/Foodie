import React from 'react'
import { FaFilter, FaSort, FaSearch } from "react-icons/fa"
import { useState } from 'react'

function CustomFilter({ searchQuery, setSearchQuery, sortBy, setSortBy, minRating, setMinRating, priceRange, setPriceRange, showFilters, setShowFilters, setDisplayCount, setHasMore, resetFilters }) {
  return (
    <>
    {/* Search and Filter Controls */}
<div className="mb-6 space-y-4">
{/* Search Bar */}
<div className="relative">
  <input
    type="text"
    placeholder="Search restaurants..."
    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ac073]"
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setDisplayCount(16);
      setHasMore(true);
    }}
  />
  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
</div>

{/* Filter and Sort Controls */}
<div className="flex flex-wrap gap-3">
  <button
    className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
    onClick={() => setShowFilters(!showFilters)}
  >
    <FaFilter /> Filters
  </button>
  
  <div className="relative ">
    <select
      className="appearance-none px-4 py-2 bg-gray-100 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-transparent"
      value={sortBy}
      onChange={(e) => {
        setSortBy(e.target.value);
        setDisplayCount(16);
        setHasMore(true);
      }}
    >
      <option value="default">Sort By</option>
      <option value="rating-high">Rating: High to Low</option>
      <option value="rating-low">Rating: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="price-low">Price: Low to High</option>
      <option value="name-asc">Name: A to Z</option>
      <option value="name-desc">Name: Z to A</option>
    </select>
    <FaSort className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
  
  <button
    className="px-4 py-2 bg-[#1ac073] text-white rounded-lg hover:bg-[#1ac073]/90 cursor-pointer transition-colors"
    onClick={resetFilters}
  >
    Reset Filters
  </button>
</div>

{/* Filter Panel */}
{showFilters && (
  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
    <h3 className="text-lg font-medium mb-3">Filters</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Minimum Rating
        </label>
        <div className="flex items-center gap-2">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              className={`px-3 py-1 cursor-pointer rounded-full ${
                minRating === rating
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => {
                setMinRating(rating);
                setDisplayCount(16);
                setHasMore(true);
              }}
            >
              {rating === 0 ? "All" : rating}
            </button>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price Range
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "All" },
            { value: "0-300", label: "Under ₹300" },
            { value: "300-500", label: "₹300 - ₹500" },
            { value: "500-1000", label: "₹500 - ₹1000" },
            { value: "1000-", label: "Over ₹1000" }
          ].map((range) => (
            <button
              key={range.value}
              className={`px-3 py-1 cursor-pointer rounded-full ${
                priceRange === range.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => {
                setPriceRange(range.value);
                setDisplayCount(16);
                setHasMore(true);
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
</div>
</>
  )
}

export default CustomFilter