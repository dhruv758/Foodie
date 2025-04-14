import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import CartHeader from './CartHeader';
import CartFooter from './CartFooter';
import foodImage from '../../assets/noodle.png';
import deleteIcon from '../../assets/delete-icon.png'; // ✅ Your trash icon

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
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-[773px] max-h-[648px] bg-white rounded-lg shadow-lg p-4 flex flex-col relative">
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

        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 text-2xl">Your cart is empty</p>
          </div>
        ) : (
          <>
            <CartHeader itemCount={cartItems.length} />
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="w-full border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center p-4 h-[100px]">
                    {/* Image */}
                    <div className="mr-4 overflow-hidden rounded relative" style={{ width: '80px', height: '82.29px' }}>
                      <img
                        src={item.image || foodImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">By {item.restaurant}</p>
                      <p className="text-black font-semibold text-sm mt-1">₹{item.price}</p>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="ml-4 hover:opacity-80"
                    >
                      <img src={deleteIcon} alt="Delete" className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <CartFooter cartItems={cartItems} onPollInitiated={onClose} />
          </>
        )}
      </div>
    </div>
  );
};

export default CartPopup;
