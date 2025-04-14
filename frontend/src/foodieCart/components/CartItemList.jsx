import React from 'react';
import CartItem from './CartItem';

const CartItemList = ({ items, onRemove }) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
};

export default CartItemList;
