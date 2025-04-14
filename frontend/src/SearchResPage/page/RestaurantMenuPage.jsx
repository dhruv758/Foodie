import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../../HomePage/components/HomeNavbar";
import axios from "axios";
import { useCart } from "../../foodieCart/Context/CartContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, Search, X } from "lucide-react";
import debounce from "lodash.debounce"; // You'll need to install this: npm install lodash.debounce

const RestaurantMenuPage = () => {
  const [searchParams] = useSearchParams();
  const { restaurantId } = useParams();
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const { addToCart, cartItems, removeFromCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [topPicks, setTopPicks] = useState([]); // State for top picks
  
  // Extract all menu items once during data load
  const [allMenuItems, setAllMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        console.log("Fetching menu for restaurant ID:", restaurantId);
        const name = searchParams.get("name");
        // Get the menu items from your backend API
        const response = await axios.get(`http://localhost:3000/api/swiggy/menu?restaurantId=${restaurantId}&name=${name}`);
        console.log("API response:", response.data);
        
        if (response.data) {
          // Extract top picks
          const extractedTopPicks = [];
          if (response.data.topPics && Array.isArray(response.data.topPics)) {
            // Log the first top pick to see its structure
            if (response.data.topPics.length > 0) {
              console.log("First top pick structure:", JSON.stringify(response.data.topPics[0], null, 2));
            }
            
            // Try different ways to extract the info
            response.data.topPics.forEach(item => {
              // Check if the item has an info property directly
              if (item.dish && item.dish.info) {
                extractedTopPicks.push(item.dish.info);
              } else if (item.info) {
                extractedTopPicks.push(item.info);
              }
            });
            
            console.log("Extracted top picks:", extractedTopPicks);
            setTopPicks(extractedTopPicks);
          }
          
          // Extract regular menu items
          const extractedItems = [...extractedTopPicks]; // Include top picks in search
          
          if (response.data.items && response.data.items.cards) {
            setMenuData(response.data.items.cards);
            
            // Process each card to extract menu items
            response.data.items.cards.forEach(card => {
              // Check if this card has itemCards
              if (card.card?.card?.itemCards) {
                card.card.card.itemCards.forEach(item => {
                  if (item.card?.info) {
                    extractedItems.push(item.card.info);
                  }
                });
              }
            });
            
            setAllMenuItems(extractedItems);
            
            // Try to extract restaurant info if available
            if (response.data.items.cards[0]?.card?.card?.info) {
              setRestaurant(response.data.items.cards[0].card.card.info);
            }
          } else {
            setError("Menu data structure is not as expected");
          }
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError(`Failed to load menu items: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId, searchParams]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      
      const normalizedQuery = query.toLowerCase().trim();
      
      // Filter items that contain the search query in name or description
      const results = allMenuItems.filter(item => {
        if (!item) return false;
        
        const nameMatch = item.name && item.name.toLowerCase().includes(normalizedQuery);
        const descMatch = item.description && item.description.toLowerCase().includes(normalizedQuery);
        
        return nameMatch || descMatch;
      });
      
      console.log(`Search for "${normalizedQuery}" found ${results.length} results`);
      setSearchResults(results);
    }, 300), // 300ms debounce time
    [allMenuItems]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Check if an item is in the cart
  const isItemInCart = (itemId) => {
    return cartItems.some(item => item.id === itemId);
  };

  // Handle add/remove from cart
  const handleCartAction = (item) => {
    const isInCart = isItemInCart(item.id);
    
    if (isInCart) {
      removeFromCart(item.id);
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price / 100 || item.defaultPrice / 100 || item.finalPrice / 100,
        image: item.imageId ? `https://media-assets.swiggy.com/swiggy/image/upload/${item.imageId}` : null,
        quantity: 1,
        restaurant: restaurant?.name || "Restaurant"
      });
    }
  };

  // Render a menu item card
  const renderMenuItem = (item) => {
    if (!item || !item.id) {
      console.error("Invalid menu item:", item);
      return null;
    }
    
    const isInCart = isItemInCart(item.id);
    const price = item.price / 100 || item.defaultPrice / 100 || item.finalPrice / 100 || 0;
    
    return (
      <div key={item.id} className="border rounded-lg p-4 flex shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{item.name}</h4>
          <p className="text-sm font-semibold text-gray-700 mt-1">
            ₹{price}
          </p>
          {item.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
        <div className="ml-4 flex flex-col items-end justify-between">
          {item.imageId && (
            <img 
              src={`https://media-assets.swiggy.com/swiggy/image/upload/${item.imageId}`} 
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg mb-2"
            />
          )}
          <Button 
            variant={isInCart ? "destructive" : "default"}
            size="sm"
            className={`mt-2 ${isInCart ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
            onClick={() => handleCartAction(item)}
          >
            {isInCart ? (
              <>
                <MinusCircle className="h-4 w-4 mr-1" /> Remove
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-1" /> Add
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-screen-xl mx-auto p-4">
          <div className="text-center py-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="border rounded-lg p-4 flex">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="ml-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
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
            <p className="text-gray-600">{restaurant.area || restaurant.areaName}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 sticky top-16 z-10 bg-white pt-2 pb-4 shadow-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for dishes..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Search Results {searchResults.length > 0 ? `(${searchResults.length})` : ''}
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map(item => renderMenuItem(item))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No dishes found matching "{searchQuery}"</p>
            )}
          </div>
        )}

        {/* Top Picks / Bestseller Section - Only show when not searching */}
        {!searchQuery && topPicks.length > 0 && (
          <div className="border-b pb-6 mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <span className="text-yellow-500 mr-2">★</span> Bestseller
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topPicks.map(item => renderMenuItem(item))}
            </div>
          </div>
        )}

        {/* Menu Categories (only show when not searching) */}
        {!searchQuery && (
          <div className="space-y-8">
            {menuData.map((categoryCard, index) => {
              // Skip if this is not an item category
              if (!categoryCard.card?.card) return null;
              
              const cardData = categoryCard.card.card;
              
              // Check if this is a category with items
              const categoryItems = cardData.itemCards || [];
              const categoryTitle = cardData.title;
              
              if (!categoryTitle || categoryItems.length === 0) return null;
              
              return (
                <div key={index} className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">{categoryTitle}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryItems.map((item, itemIndex) => {
                      // Extract the dish info from the nested structure
                      const itemInfo = item?.card?.info;
                      if (!itemInfo) return null;
                      
                      return renderMenuItem(itemInfo);
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantMenuPage;
