import { useEffect, useState } from "react"
import Header from "../../HomePage/components/HomeNavbar"
import FoodCard from "../components/FoodCart"
import { useLocation } from "react-router-dom"
import { useCart } from "../../foodieCart/Context/CartContext"
import InfiniteScroll from "react-infinite-scroll-component"
import CustomFilter from "../components/CustomFilter"
const SearchResPage = () => {
  const location = useLocation()
  const apiData = location.state?.data || []
  const [foods, setFoods] = useState([])
  const [selectedType, setSelectedType] = useState("")
  const { cartItems, addToCart, setCartItems } = useCart()
  const [hasMore, setHasMore] = useState(true)
  const [displayCount, setDisplayCount] = useState(16) // Number of items to show initially
  
  // Filter and sort states
  const [showFilters, setShowFilters] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [priceRange, setPriceRange] = useState("all")

  useEffect(() => {
    if (apiData && Array.isArray(apiData)) {
      const transformedFoods = apiData.map((item, index) => {
        // Extract restaurant data from the nested structure
        const restaurantInfo = item?.card?.card?.info || {}

        // Extract cuisine types
        const cuisineTypes = restaurantInfo.cuisines || []
        const primaryType = cuisineTypes.length > 0 ? cuisineTypes[0] : "Unknown"

        // Extract rating
        const rating = restaurantInfo.avgRating || 4.0

        // Extract image ID
        const imageId = restaurantInfo.cloudinaryImageId || ""

        // Construct image URL (adjust base URL as needed for your Cloudinary setup)
        const imageUrl = imageId
          ? `https://media-assets.swiggy.com/swiggy/image/upload/${imageId}`
          : "https://via.placeholder.com/300x200?text=No+Image"

        // Extract price
        const price = restaurantInfo.costForTwoMessage || "₹200"
        
        // Extract price value for sorting
        const priceValue = parseInt(price.replace(/[^0-9]/g, "")) || 0

        const sla = restaurantInfo.sla || {};
        const deliveryTime = sla.slaString || `${sla.minDeliveryTime || 30}-${sla.maxDeliveryTime || 40} MINS`;

        // Extract and combine discount information
        const discountInfo = restaurantInfo.aggregatedDiscountInfoV3 || {};
        const discountHeader = discountInfo.header || "";
        const discountSubHeader = discountInfo.subHeader || "";
        
        // Combine header and subHeader for offer text
        let offerText = "";
        if (discountHeader && discountSubHeader) {
          offerText = `${discountHeader} ${discountSubHeader}`;
        } else if (discountHeader) {
          offerText = discountHeader;
        } else if (discountSubHeader) {
          offerText = discountSubHeader;
        } else {
          // Display "No offers" when no discount info is available
          offerText = "No offers";
        }

        return {
          id: restaurantInfo.id || (index + 1).toString(),
          name: restaurantInfo.name || "Unknown Restaurant",
          image: imageUrl,
          price: offerText,
          priceValue: priceValue, // Add price value for sorting
          type: primaryType,
          rating: Number.parseFloat(rating),
          restaurant: restaurantInfo.name || "Unknown Restaurant",
          deliveryTime: deliveryTime, // Added delivery time
          area: restaurantInfo.areaName || "Unknown Area",
          locality: restaurantInfo.locality || "",
        }
      })
      setFoods(transformedFoods)
    }
  }, [apiData])

  // Apply filters and sorting
  const applyFiltersAndSort = () => {
    let result = [...foods];
    
    // Apply type filter
    if (selectedType) {
      result = result.filter(food => food.type.toLowerCase() === selectedType.toLowerCase());
    }
    
    // Apply rating filter
    if (minRating > 0) {
      result = result.filter(food => food.rating >= minRating);
    }
    
    // Apply price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter(food => {
        if (max) {
          return food.priceValue >= min && food.priceValue <= max;
        } else {
          return food.priceValue >= min;
        }
      });
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(food => 
        food.name.toLowerCase().includes(query) || 
        food.type.toLowerCase().includes(query) ||
        food.area.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "rating-high":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "price-high":
        result.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "price-low":
        result.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (original order)
        break;
    }
    
    return result;
  };

  const filteredFoods = applyFiltersAndSort();

  // Function to load more items
  const fetchMoreData = () => {
    // Simulate loading more data
    setTimeout(() => {
      if (displayCount >= filteredFoods.length) {
        setHasMore(false);
        return;
      }
      
      // Increase the display count by 8 items
      setDisplayCount(prevCount => prevCount + 8);
    }, 500); // Simulate network delay
  };

  // Get the currently displayed items
  const displayedFoods = filteredFoods.slice(0, displayCount);

  // Reset filters
  const resetFilters = () => {
    setMinRating(0);
    setPriceRange("all");
    setSearchQuery("");
    setSortBy("default");
    setDisplayCount(16);
    setHasMore(true);
  };

  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto p-4">
        {/* {foods.length > 0 && <FoodTypeSelector selectedType={selectedType} handleTypeSelect={handleTypeSelect} />} */}
        
        <CustomFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minRating={minRating}
        setMinRating={setMinRating}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        resetFilters={resetFilters}
        setDisplayCount={setDisplayCount}
        setHasMore={setHasMore}
        />
        {foods.length > 0 ? (
          <InfiniteScroll
            dataLength={displayedFoods.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className="text-center py-4"><p className="text-gray-500">Loading more restaurants...</p></div>}
            endMessage={
              <div className="text-center py-4">
                <p className="text-gray-500">You have seen all restaurants</p>
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No foods found. Try a different search.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default SearchResPage