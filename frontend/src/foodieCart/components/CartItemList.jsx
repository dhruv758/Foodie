import React from 'react';
import CartItem from './CartItem';

const CartItemList = ({ items, onRemove }) => {
  return (
    <div className="space-y-2 sm:space-y-4 w-full overflow-y-auto px-1">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={() => onRemove(item.id)}
        />
      ))}
      {items.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      )}
    </div>
  );
};

export default CartItemList;
