import React from 'react';
import CartHeader from './CartHeader';
import CartItemList from './CartItemList';
import CartFooter from './CartFooter';

const CartPopup = ({ cartItems, setCartItems, onClose }) => {
  // Functions to handle cart operations
  const incrementQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Add useEffect to handle body scroll locking
  React.useEffect(() => {
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-[773px] max-h-[648px] bg-white rounded-lg shadow-lg p-4 flex flex-col relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 text-2xl">Your cart is empty</p>
          </div>
        ) : (
          <>
            <CartHeader itemCount={cartItems.length} />
            <div className="flex-1 overflow-y-auto">
              <CartItemList 
                items={cartItems}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                onRemove={removeItem}
              />
            </div>
            <CartFooter />
          </>
        )}
      </div>
    </div>
  );
};

export default CartPopup;