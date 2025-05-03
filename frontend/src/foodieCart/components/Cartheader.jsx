import React from 'react';

const CartHeader = ({ itemCount }) => {
  return (
    <div className="text-center mb-2 sm:mb-4 pt-6 sm:pt-2">
      <h2 className="text-xl sm:text-2xl font-bold">Foodie cart</h2>
      <p className="text-gray-600 text-sm sm:text-base">You have {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
    </div>
  );
};

export default CartHeader;