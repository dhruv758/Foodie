import React, { useEffect } from 'react';
import { Button } from '@/foodieCart/ui/button'; 


const CartPage = ({ onClose }) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="max-w-screen-xl w-full mx-4 bg-white rounded-lg shadow-lg p-4 flex flex-col min-h-[682px] max-h-[90vh] overflow-y-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </Button>
        
      </div>
    </div>
  );
};

export default CartPage;