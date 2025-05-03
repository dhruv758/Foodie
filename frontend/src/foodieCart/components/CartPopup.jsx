import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import CartHeader from './CartHeader';
import CartFooter from './CartFooter';
import foodImage from '../../assets/noodle.png';
import deleteIcon from '../../assets/delete-icon.png';

const CartPopup = ({ cartItems, setCartItems, onClose }) => {
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-[773px] max-h-[90vh] bg-white rounded-lg shadow-lg p-2 sm:p-4 flex flex-col relative mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>

        {/* Always show the header */}
        <CartHeader itemCount={cartItems.length} />

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="w-full border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="flex items-center p-2 sm:p-4 min-h-[80px] sm:min-h-[100px]">
                  {/* Image - smaller on mobile */}
                  <div className="mr-2 sm:mr-4 overflow-hidden rounded relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                    <img
                      src={item.image || foodImage}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details - with responsive text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{item.name}</h3>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm truncate">By {item.restaurant}</p>
                    <p className="text-black font-semibold text-xs sm:text-sm mt-1">₹{item.price}</p>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="ml-1 sm:ml-4 hover:opacity-80 p-1 sm:p-2 flex-shrink-0"
                  >
                    <img src={deleteIcon} alt="Delete" className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          )}
        </div>

        {/* Always show the footer */}
        <CartFooter cartItems={cartItems} onPollInitiated={onClose} />
      </div>
    </div>
  );
};

export default CartPopup;
