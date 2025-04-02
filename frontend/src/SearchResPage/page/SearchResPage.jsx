import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { SectionHeader, FoodTypeSelector } from '../components/SectionHeader';
import FoodCard from '../components/FoodCart';
import { useLocation } from 'react-router-dom';

const SearchResPage = () => {
  const location = useLocation();
  const apiData = location.state?.data || [];
  const [foods, setFoods] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    // Transform API data to match the format expected by FoodCard
    if (apiData && Array.isArray(apiData)) {
      const transformedFoods = apiData.map((item, index) => {
        // Extract restaurant data from the ListItem structure
        const restaurant = item?.item || {};
        
        // Get cuisine types
        const cuisineTypes = restaurant.servesCuisine
          ? restaurant.servesCuisine.split(',').map(cuisine => cuisine.trim())
          : [];
        
        // Extract first cuisine as type
        const primaryType = cuisineTypes.length > 0 ? cuisineTypes[0] : 'Unknown';
        
        // Get rating from aggregateRating object if available
        const rating = restaurant.aggregateRating?.ratingValue || 4.0;
        
        return {
          id: index + 1, // Generate unique ID
          name: restaurant.name || 'Unknown Restaurant',
          image: restaurant.image || 'https://via.placeholder.com/300x200?text=No+Image',
          price: '₹200', // Default price since not provided in API
          type: primaryType,
          rating: parseFloat(rating)
        };
      });
      
      setFoods(transformedFoods);
    }
  }, [apiData]);

  const addToCart = (food) => {
    if (!cartItems.find((item) => item.id === food.id)) {
      setCartItems([...cartItems, food]);
    }
  };

  const removeFromCart = (foodId) => {
    setCartItems(cartItems.filter((item) => item.id !== foodId));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handlePlusClick = () => {
    alert('Plus button clicked! Add your functionality here.');
  };

  // Filter foods based on selected type
  const filteredFoods = selectedType
    ? foods.filter((food) => food.type.toLowerCase() === selectedType.toLowerCase())
    : foods;

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <Header cartCount={cartItems.length} />
      <SectionHeader handlePlusClick={handlePlusClick} />
      
      {foods.length > 0 && (
        <FoodTypeSelector
          selectedType={selectedType}
          handleTypeSelect={handleTypeSelect}
        />
      )}
      
      {foods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              cartItems={cartItems}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No foods found. Try a different search.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResPage;
 
