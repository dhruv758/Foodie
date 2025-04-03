import React from 'react';

const QuantityControls = ({ quantity, onIncrement, onDecrement, onRemove, deleteImage }) => {
  return (
    <div className="flex items-center">
      <div className="flex h-8 border border-gray-200 rounded-md overflow-hidden">
        <button
          onClick={onDecrement}
          className="h-full w-8 bg-red-500 text-white border-none hover:bg-red-600"
        >
          -
        </button>
        <div className="flex items-center justify-center w-8 bg-white text-black text-sm font-medium">
          {quantity}
        </div>
        <button
          onClick={onIncrement}
          className="h-full w-8 bg-green-500 text-white border-none hover:bg-green-600"
        >
          +
        </button>
      </div>
      <button
        onClick={onRemove}
        className="h-8 w-15 ml-10 flex items-center justify-center"
      >
        <img src={deleteImage} alt="Trash Icon" className="h-6 w-6" />
      </button>
    </div>
  );
};

export default QuantityControls;