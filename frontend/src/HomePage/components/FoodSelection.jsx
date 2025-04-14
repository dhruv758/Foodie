import { getRestauantSwigyData, searchDish } from '../api/zomatoApi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const FoodSelection = () => {
  const navigate = useNavigate();
  const [foodItems, setFoodItem] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);
  const itemsPerScroll = 5; // Number of items to scroll at once

  const getRestauantData = async () => {
    try {
      const data = await getRestauantSwigyData();
      setFoodItem(data);
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
    const data = await searchDish(name);
    const formattedText = name.toLowerCase().replace(/\s+/g, '+');
    navigate(`/search?name=${formattedText}`, { state: { data } });
  };

  return (
    <div className="w-full mt-4 mb-15 overflow-hidden">
      {/* Header Section */}
      <div className="w-[75%] mx-auto mt-3 mb-6">
        <div className="flex justify-between items-center">
          {/* Heading */}
          <h2 className="font-semibold text-3xl">
            What's on your mind?
          </h2>
          {/* Navigation buttons */}
          <div className="flex gap-3">
            <button 
              onClick={() => handleScroll('left')} 
              className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center w-10 h-10 border border-gray-200"
              disabled={scrollPosition <= 0}
            >
              <FiChevronLeft className={`text-xl ${scrollPosition <= 0 ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
            <button 
              onClick={() => handleScroll('right')} 
              className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center w-10 h-10 border border-gray-200"
            >
              <FiChevronRight className="text-xl text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Items Section - Single Row */}
      <div className="w-[81%] mx-auto relative">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-hidden scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {foodItems?.info?.map((food, index) => (
            <div
              onClick={() => handleItemClick(food.action?.text)}
              key={food.id || index}
              className="flex flex-col items-center flex-shrink-0 mx-3 transition-transform hover:scale-105"
            >
              <div className="w-32 h-32 md:w-36 md:h-36 mb-2 overflow-hidden">
                <img 
                  src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/PC_Mweb/${
                    food.action.text === 'Waffle'
                      ? 'Waffles'
                      : ['Noodles', 'Rolls'].includes(food.action.text)
                        ? food.action.text
                        : food.action.text.endsWith('s')
                          ? food.action.text.slice(0, -1)
                          : food.action.text
                  }.png`} 
                  alt={food.action.text} 
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
              {/* Removed the dish name text */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodSelection;
