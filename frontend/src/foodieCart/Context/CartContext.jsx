// import { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();
// export const useCart = () => {
//   return useContext(CartContext);
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   // Load cart from localStorage on initial load
//   useEffect(() => {
//     const savedCart = localStorage.getItem("cartItems");
//     if (savedCart) {
//       setCartItems(JSON.parse(savedCart));
//     }
//   }, []);

//   // Save cart to localStorage whenever cartItems change
//   useEffect(() => {
//     if (cartItems.length > 0) {
//       localStorage.setItem("cartItems", JSON.stringify(cartItems));
//     }
//   }, [cartItems]);

//   const addToCart = (item) => {
//     setCartItems((prevCart) => {
//       const updatedCart = [...prevCart, item];
//       return updatedCart;
//     });
//   };

//   const removeFromCart = (itemId) => {
//     setCartItems((prevCart) => prevCart.filter(item => item.id !== itemId));
//   };

//   const emptyCart = () => {
//     setCartItems([]);
//     localStorage.removeItem("cartItems"); // Clear from localStorage as well
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, emptyCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
// src/foodieCart/Context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  // Add the removeFromCart function
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const emptyCart = ()=>{
    setCartItems([])
  }

  // Add updateQuantity function for future use
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      emptyCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);