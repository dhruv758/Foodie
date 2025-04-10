import { useNavigate } from "react-router-dom";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/restaurant/${food.id}`);
  };
  return (
    <div onClick={handleCardClick} className="relative border rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
      {/* Food Image with Offer Banner */}
      <div className="relative">
        <img src={food.image || "/placeholder.svg"} alt={food.name} className="w-full h-44 object-cover" />
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 font-semibold">
          {food.price}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-3 flex flex-col flex-grow">
        <h2 className="text-lg font-bold text-black truncate">{food.name}</h2>

        {/* Rating and Delivery Time */}
        <div className="flex items-center mt-1 mb-1">
          <span className="bg-green-700 text-white text-xs px-1 py-0.5 rounded flex items-center">
            <span>{food.rating.toFixed(1)}</span>
            <span className="ml-1">★</span>
          </span>
          <span className="text-sm text-gray-600 ml-2">
          {food.deliveryTime}
          </span>
        </div>

        {/* Food Type/Cuisine */}
        <p className="text-sm text-gray-600 truncate">
          {food.type}
          {food.type && ", "}Fast Food{food.area && ", "}Indian
        </p>

        {/* Location */}
        <p className="text-sm text-gray-600 mt-1 truncate">{food.area || food.locality || "Unknown Location"}</p>
      </div>
    </div>
  )
}

export default FoodCard
