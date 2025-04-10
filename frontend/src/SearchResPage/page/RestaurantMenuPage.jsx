import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../HomePage/components/HomeNavbar";
import axios from "axios";
import { useCart } from "../../foodieCart/Context/CartContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, Check } from "lucide-react";


const RestaurantMenuPage = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        console.log("Fetching menu for restaurant ID:", restaurantId);
        // Get the menu items from your backend API
        const response = await axios.get(`http://localhost:3000/api/swiggy/menu?restaurantId=${restaurantId}`);
        console.log("API response:", response.data); // Add this for debugging

        
        
        // Check if response has the expected structure
        if (response.data && (response.data.items || response.data.topPics)) {
          setMenuItems(response.data.items || response.data);
          
          // If restaurant info is available, set it
          if (response.data.restaurant) {
            setRestaurant(response.data.restaurant);
          }
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">Loading menu items...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="text-center py-10">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto p-4">
        {restaurant && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <p className="text-gray-600">{restaurant.cuisines?.join(", ")}</p>
            <p className="text-gray-600">{restaurant.area}</p>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
        
        {/* Display menu categories */}
        <div className="space-y-8">
          {Array.isArray(menuItems) && menuItems.map((category, index) => {
            // Check if this is a category card with items
            const categoryItems = category?.card?.card?.itemCards || [];
            const categoryTitle = category?.card?.card?.title || `Category ${index + 1}`;
            
            if (categoryItems.length === 0) return null;
            
            return (
              <div key={index} className="border-b pb-6">
                <h3 className="text-lg font-medium mb-4">{categoryTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryItems.map((item, itemIndex) => {
                    const itemInfo = item?.card?.info || {};
                    return (
                      <div key={itemIndex} className="border rounded-lg p-4 flex">
                        <div className="flex-1">
                          <h4 className="font-medium">{itemInfo.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            ₹{itemInfo.price / 100 || itemInfo.defaultPrice / 100}
                          </p>
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            {itemInfo.description}
                          </p>
                        </div>
                        {itemInfo.imageId && (
                          <div className="ml-4 relative">
                            <img 
                              src={`https://media-assets.swiggy.com/swiggy/image/upload/${itemInfo.imageId}`} 
                              alt={itemInfo.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <button 
                              className="absolute bottom-0 right-0 bg-white text-green-600 border border-green-600 px-2 py-1 rounded text-xs"
                              onClick={() => addToCart({
                                id: itemInfo.id,
                                name: itemInfo.name,
                                price: itemInfo.price / 100 || itemInfo.defaultPrice / 100,
                                image: itemInfo.imageId ? `https://media-assets.swiggy.com/swiggy/image/upload/${itemInfo.imageId}` : null,
                                quantity: 1,
                                restaurant: restaurant?.name || "Restaurant"
                              })}
                            >
                              ADD
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RestaurantMenuPage;
