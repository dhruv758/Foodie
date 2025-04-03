import React from 'react';
import QuantityControls from './QuantityControls';
import deleteIcon from '../../assets/delete-icon.png';
import foodImage from '../../assets/noodle.png';

const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center p-4 h-[100px]">
        <div 
          className="mr-4 overflow-hidden rounded relative"
          style={{ width: '80px', height: '82.29px' }}
        >
          <img
            src={item.image || foodImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h3 className="font-semibold text-lg">{item.name}</h3>
          </div>
          <p className="text-gray-600 text-sm">By {item.restaurant}</p>
        </div>

        <QuantityControls
          quantity={item.quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onRemove={onRemove}
          deleteImage={deleteIcon}
        />
      </div>
    </div>
  );
};

export default CartItem;