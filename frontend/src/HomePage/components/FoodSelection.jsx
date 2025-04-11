import { getRestauantSwigyData, searchDish } from '../api/zomatoApi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import arrowLeft from '../../assets/arrow-left.png'
import arrowRight from '../../assets/arrow-right.png'

const FoodSelection = () => {
  // Food items data array

  const navigate = useNavigate();
  const [foodItems , setFoodItem]= useState("");
  const [value ,setValue] = useState(0)

  const getRestauantData = async () => {
    try {
      const data = await getRestauantSwigyData();
      setFoodItem(data);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };
  console.log(value)
  const handleRightClick = ()=>{
    value>=200 ? value>=250 ? value(250): setValue(value +50) :setValue(value + 100);
  }
  
  const handleLeftClick = ()=>{
    value<=0 ? setValue(0) : setValue(value - 100);
  }
 

  useEffect(()=>{
    getRestauantData();
  },[])

  
  const handleItemClick = async(name)=>{
    console.log(name);
    const data = await searchDish(name)
    console.log(data);

    navigate("/search" , { state: { data } })

  }


  return (
    <div className="w-full mt-15 mb-15 overflow-hidden">
      {/* Header Section */}
      <div className="w-[75%] mx-auto mt-3 overflow-hidden">
        <div className="flex justify-between ">
          {/* Heading on the right with right text alignment */}
          <h2 className="font-bold text-4xl text-right">
            What's on your mind?
          </h2>
          {/* Icon group on the left */}
          <div className="flex gap-3">
            <button  onClick={handleLeftClick}  className="bg-grey p-2">

            <img
                  src={arrowLeft}
                  alt="Cart"
                          className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
                />
            </button>
            <button onClick={handleRightClick} className="bg-grey p-2">
              {/* <FiSearch className="text-gray-500 text-2xl" /> */}
              <img
                  src={arrowRight}
                  alt="Cart"
                 className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
                />

            </button>
          </div>
        </div>
      </div>

        {/* Items Section */}
      <div    className="w-[81%] mx-auto mt-3 grid grid-rows-2 grid-flow-col gap-4  overflow-hidden  ">
        {foodItems?.info?.map((food, index) => (
          <div
            onClick={() => handleItemClick(food.action?.text)}
            key={food.id || index}
            className="flex flex-col items-center"
          >
            <div  style={{translate: `-${value}%`}}  className="w-24 h-24 md:w-40 md:h-40  mb-2 overflow-hidden duration-300">
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
                className="w-full h-full object-cover cursor-pointer "
              />
            </div>
          </div>
        ))}
      </div>
</div>

  );
};

export default FoodSelection;