import React, { useEffect } from 'react';
import CartHeader from '../components/CartHeader';
import CartItemList from '../components/CartItemList';
import CartFooter from '../components/CartFooter';
import Header from '../../SearchResPage/components/Header';
import { Link } from 'react-router-dom';

const CartPage = ({ cartItems, setCartItems, onClose }) => {
  const incrementQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="max-w-screen-xl w-full mx-4 bg-white rounded-lg shadow-lg p-4 flex flex-col min-h-[682px] max-h-[90vh] overflow-y-auto">
        <button 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <Header cartCount={cartItems.length} />
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-600 text-2xl mb-4">Your cart is empty</p>
            <Link 
              to="/search" 
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
              onClick={onClose} // Close cart when navigating
            >
              Browse Items
            </Link>
          </div>
        ) : (
          <>
            <CartHeader itemCount={cartItems.length} />
            <div className="flex-1 overflow-y-auto">
              <CartItemList 
                items={cartItems}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                onRemove={removeItem}
              />
            </div>
            <CartFooter />
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;