import { useNavigate, useSearchParams } from "react-router-dom";

const FoodCard = ({ food }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    // Make sure we're passing the restaurant name correctly
    // Use food.name as the restaurant name if available
    const restaurantName = food.name || food.restaurantName || searchParams.get('name') || "Restaurant";
    
    // Encode the restaurant name to handle special characters in URLs
    const encodedName = encodeURIComponent(restaurantName);
    
    // Navigate with the restaurant name in the URL
    navigate(`/restaurant/${food.id}?name=${encodedName}`);
  };

  return (
    <div onClick={handleCardClick} className="relative border rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 flex flex-col h-full">
      {/* Food Image with Offer Banner */}
      <div className="relative">
        <img src={food.image || "/placeholder.svg"} alt={food.name} className="w-full h-44 object-cover" />
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 font-semibold">
          {food.price}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-3 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-black truncate">
          {food.name}
        </h2>
        <div className="flex items-center mt-1 mb-1">
          <span className="bg-green-700 text-white text-xs px-1 py-0.5 rounded flex items-center">
            {food.rating} <span className="ml-0.5">★</span>
          </span>
          <span className="text-sm text-gray-600 ml-2">{food.deliveryTime}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{food.type}</p>
        <p className="text-sm text-gray-600 truncate">{food.area || food.locality || ""}</p>
      </div>
    </div>
  );
};

export default FoodCard;
