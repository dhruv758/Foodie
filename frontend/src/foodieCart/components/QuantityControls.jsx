import React from 'react';
import { Button } from '@/components/ui/button'; // Adjust path

const QuantityControls = ({ quantity, onIncrement, onDecrement, onRemove, deleteImage }) => {
  return (
    <div className="flex items-center">
      <div className="flex h-8 border border-gray-200 rounded-md overflow-hidden">
        <Button
          onClick={onDecrement}
          className="h-full w-8 bg-[#DF3454] text-white hover:bg-red-600"
        >
          -
        </Button>
        <div className="flex items-center justify-center w-8 bg-white text-black text-sm font-medium">
          {quantity}
        </div>
        <Button
          onClick={onIncrement}
          className="h-full w-8 bg-[#1ac073] text-white hover:bg-green-600"
        >
          +
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-15 ml-10 flex items-center justify-center"
      >
        <img src={deleteImage} alt="Trash Icon" className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default QuantityControls;