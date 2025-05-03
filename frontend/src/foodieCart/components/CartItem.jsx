import React from 'react';
import { useCart } from '../context/CartContext';
import deleteIcon from '../../assets/delete-icon.png'; 

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between border rounded-xl p-2 sm:p-4 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-semibold truncate">{item.name}</h2>
          <p className="text-xs sm:text-sm text-gray-500 truncate">By {item.restaurant || "Restaurant"}</p>
          <div className="flex gap-1 sm:gap-2 items-center mt-1">
            <span className="text-xs sm:text-sm font-medium text-green-600">₹{item.price}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={() => removeFromCart(item.id)}
        className="ml-2 sm:ml-4 flex-shrink-0"
      >
        <img
          src={deleteIcon}
          alt="Delete"
          className="w-4 h-4 sm:w-5 sm:h-5 hover:opacity-80"
        />
      </button>
    </div>
  );
};

export default CartItem;
