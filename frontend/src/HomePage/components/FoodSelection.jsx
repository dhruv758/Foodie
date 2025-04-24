import { getRestauantSwigyData, searchDish } from '../api/zomatoApi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const FoodSelection = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItem] = useState("");
  const [loading, setLoading] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);
  const itemsPerScroll = 5; // Number of items to scroll at once

  const getRestauantData = async () => {
    try {
        setLoading(true)
        const data = await getRestauantSwigyData();
        if(data){
          setFoodItem(data);
        }
        setLoading(false)
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  useEffect(() => {
    getRestauantData();
  }, []);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const itemWidth = container.firstChild ? container.firstChild.offsetWidth : 0;
    const scrollAmount = itemWidth * itemsPerScroll;
    
    if (direction === 'right') {
      const newPosition = Math.min(
        scrollPosition + scrollAmount,
        container.scrollWidth - container.clientWidth
      );
      setScrollPosition(newPosition);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
    } else {
      const newPosition = Math.max(scrollPosition - scrollAmount, 0);
      setScrollPosition(newPosition);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const handleItemClick = async(name) => {
    const formattedText = name.toLowerCase().replace(/\s+/g, '+');
    navigate(`/search?name=${formattedText}`);
  };

  return (
    <div className="w-full mt-2 sm:mt-3 lg:mt-4 mb-8 sm:mb-10 lg:mb-15 overflow-hidden">
      {/* Header Section */}
      <div className="w-[90%] sm:w-[85%] lg:w-[75%] mx-auto mt-2 sm:mt-3 lg:mt-3 mb-3 sm:mb-4 lg:mb-6">
        <div className="flex justify-between items-center">
          {/* Heading */}
          <h2 className="font-semibold text-xl sm:text-2xl lg:text-3xl">
            What's on your mind?
          </h2>
          {/* Navigation buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={() => handleScroll('left')} 
              className="bg-white cursor-pointer p-1 sm:p-2 rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center w-8 h-8 sm:w-9 lg:w-10 sm:h-9 lg:h-10 border border-gray-200"
              disabled={scrollPosition <= 0}
            >
              <FiChevronLeft className={`text-lg sm:text-xl ${scrollPosition <= 0 ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
            <button 
              onClick={() => handleScroll('right')} 
              className="bg-white cursor-pointer p-1 sm:p-2 rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center w-8 h-8 sm:w-9 lg:w-10 sm:h-9 lg:h-10 border border-gray-200"
            >
              <FiChevronRight className="text-lg sm:text-xl text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Items Section - Single Row */}
      <div>
        {loading ? (
          <>
            <div className="w-[90%] sm:w-[85%] lg:w-[81%] mx-auto relative">
              <div
                className="flex overflow-x-hidden scroll-smooth mt-4 sm:mt-6 lg:mt-10 ml-2 sm:ml-3 lg:ml-5"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-shrink-0 mx-2 sm:mx-3 transition-transform hover:scale-105"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-30 lg:h-30 mb-2 overflow-hidden bg-gray-300 animate-pulse rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-[90%] sm:w-[85%] lg:w-[81%] mx-auto relative">
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-hidden scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {foodItems?.info?.map((food, index) => (
                  <div
                    onClick={() => handleItemClick(food.action?.text)}
                    key={food.id || index}
                    className="flex flex-col items-center flex-shrink-0 mx-2 sm:mx-3 transition-transform hover:scale-105"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mb-2 overflow-hidden">
                      <img
                        src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/PC_Mweb/${
                          food.action.text === "Waffle"
                            ? "Waffles"
                            : ["Noodles", "Rolls"].includes(food.action.text)
                            ? food.action.text
                            : food.action.text.endsWith("s")
                            ? food.action.text.slice(0, -1)
                            : food.action.text
                        }.png`}
                        alt={food.action.text}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                    {/* Optionally remove or add the dish name text here */}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FoodSelection;
