import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevCart) => {
      const updatedCart = [...prevCart, item];
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => prevCart.filter(item => item.id !== itemId));
  };

  const emptyCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems"); // Clear from localStorage as well
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, emptyCart }}>
      {children}
    </CartContext.Provider>
  );
};
