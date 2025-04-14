import React from 'react';
// import { Badge } from '@/components/ui/badge';
import { useCart } from '../context/CartContext';
import deleteIcon from '../../assets/delete-icon.png'; 

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between border rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="text-sm text-gray-500">{restaurant.name}</p>
          <div className="flex gap-2 items-center mt-1">
            {/* <Badge variant={item.isVeg ? 'default' : 'destructive'}>
              {item.isVeg ? 'Veg' : 'Non-Veg'}
            </Badge> */}
            <span className="text-sm font-medium text-green-600">₹{item.price}</span>
          </div>
        </div>
      </div>
      <button onClick={() => removeFromCart(item)}>
        <img
          src={deleteIcon}
          alt="Delete"
          className="w-5 h-5 hover:opacity-80"
        />
      </button>
    </div>
  );
};

export default CartItem;
