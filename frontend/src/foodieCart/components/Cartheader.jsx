import React from 'react';

const CartHeader = ({ itemCount }) => {
  return (
    <div className="text-center mb-4">
      <h2 className="text-2xl font-bold">Foodie cart</h2>
      <p className="text-gray-600">You have {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
    </div>
  );
};

export default CartHeader;