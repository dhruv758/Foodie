import React from 'react';
import CartItem from './CartItem';

const CartItemList = ({ items, onIncrement, onDecrement, onRemove }) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrement={() => onIncrement(item.id)}
          onDecrement={() => onDecrement(item.id)}
          onRemove={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
};

export default CartItemList;