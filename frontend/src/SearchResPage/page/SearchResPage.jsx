import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { SectionHeader, FoodTypeSelector } from '../components/SectionHeader';
import FoodCard from '../components/FoodCart'; // Fixed typo in import
import CartPopup from '../../foodieCart/components/CartPopup';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../foodieCart/Context/CartContext'; // Import CartContext

const SearchResPage = () => {
  const location = useLocation();
  const apiData = location.state?.data || [];
  const [foods, setFoods] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, addToCart, setCartItems } = useCart(); // Use CartContext

  useEffect(() => {
    if (apiData && Array.isArray(apiData)) {
      const transformedFoods = apiData.map((item, index) => {
        const restaurant = item?.item || {};
        const cuisineTypes = restaurant.servesCuisine
          ? restaurant.servesCuisine.split(',').map(cuisine => cuisine.trim())
          : [];
        const primaryType = cuisineTypes.length > 0 ? cuisineTypes[0] : 'Unknown';
        const rating = restaurant.aggregateRating?.ratingValue || 4.0;

        return {
          id: index + 1, // Consider using a unique ID from the API if available
          name: restaurant.name || 'Unknown Restaurant',
          image: restaurant.image || 'https://via.placeholder.com/300x200?text=No+Image',
          price: '₹200',
          type: primaryType,
          rating: parseFloat(rating),
          restaurant: restaurant.name || 'Unknown Restaurant',
          quantity: 1,
        };
      });
      setFoods(transformedFoods);
    }
  }, [apiData]);

  const removeFromCart = (foodId) => {
    setCartItems(cartItems.filter((item) => item.id !== foodId));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handlePlusClick = () => {
    alert('Plus button clicked! Add your functionality here.');
  };

  const filteredFoods = selectedType
    ? foods.filter((food) => food.type.toLowerCase() === selectedType.toLowerCase())
    : foods;

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div
        className={`max-w-screen-xl mx-auto p-4 transition-all duration-300 ${
          isCartOpen ? 'blur-sm' : ''
        }`}
      >
      <Header 
        cartCount={cartItems.length} 
        onCartClick={() => setIsCartOpen(true)}
      />
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
              addToCart={addToCart} // Use addToCart from CartContext
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
      {isCartOpen && (
        <CartPopup 
          cartItems={cartItems} 
          setCartItems={setCartItems}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchResPage;