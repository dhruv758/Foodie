// src/components/FoodCard.jsx
import React from 'react';
import addButton from '../../assets/add-button.png';
import shoppingBasket from '../../assets/shopping-basket.png';

const FoodCard = ({ food, cartItems, addToCart, removeFromCart }) => {
  const isInCart = cartItems.find((item) => item.id === food.id);

  return (
    <div className="relative border rounded-lg overflow-hidden shadow-lg">
      <img src={food.image} alt={food.name} className="w-full h-44 object-cover" />
      <div className="p-4 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-black">{food.name}</h2>
          <span className="text-sm text-gray-600 px-2 py-1 rounded">
            {food.rating.toFixed(1)} ★
          </span>
        </div>
        {isInCart ? (
          <button
            onClick={() => removeFromCart(food.id)}
            className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded mt-auto flex items-center justify-center space-x-2"
          >
            <img src={shoppingBasket} alt="Remove" className="w-5 h-5" />
            <span>Remove</span>
          </button>
        ) : (
          <button
            onClick={() => addToCart(food)}
            className="bg-green-500 text-white font-semibold px-4 py-2 rounded mt-auto flex items-center justify-center space-x-2"
          >
            <img src={addButton} alt="Add to Cart" className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCard;