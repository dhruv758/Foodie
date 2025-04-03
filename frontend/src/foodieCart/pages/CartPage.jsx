import React from 'react';
import CartHeader from '../components/CartHeader';
import CartItemList from '../components/CartItemList';
import CartFooter from '../components/CartFooter';
import Header from '../../SearchResPage/components/Header';
import { Link } from 'react-router-dom';

const CartPage = ({ cartItems, setCartItems }) => {
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
    <div className="max-w-screen-xl mx-auto p-4">
      <Header cartCount={cartItems.length} />
      <div className="w-full bg-white rounded-lg shadow-lg p-4 flex flex-col min-h-[682px]">
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link to="/search" className="bg-green-500 text-white px-4 py-2 rounded-lg">
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