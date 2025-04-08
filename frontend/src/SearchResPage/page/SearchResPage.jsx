

import { useEffect, useState } from "react"
import Header from "../../HomePage/components/HomeNavbar"
import { SectionHeader, FoodTypeSelector } from "../components/SectionHeader"
import FoodCard from "../components/FoodCart"
import { useLocation } from "react-router-dom"
import { useCart } from "../../foodieCart/Context/CartContext"

const SearchResPage = () => {
  const location = useLocation()
  const apiData = location.state?.data || []
  const [foods, setFoods] = useState([])
  const [selectedType, setSelectedType] = useState("")
  const { cartItems, addToCart, setCartItems } = useCart()

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

  const handleTypeSelect = (type) => {
    setSelectedType(type)
  }

  const handlePlusClick = () => {
    alert("Plus button clicked! Add your functionality here.")
  }

  const filteredFoods = selectedType
    ? foods.filter((food) => food.type.toLowerCase() === selectedType.toLowerCase())
    : foods

  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto p-4">
        <SectionHeader handlePlusClick={handlePlusClick} />

        {foods.length > 0 && <FoodTypeSelector selectedType={selectedType} handleTypeSelect={handleTypeSelect} />}

        {foods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
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
