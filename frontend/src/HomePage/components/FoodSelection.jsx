import pizza from '../../assets/pizza.png';
import burger from '../../assets/burger.png';
import biryani from '../../assets/biryani.png';
import rolls from '../../assets/roll.png';
import thali from '../../assets/thali.png';
import noodles from '../../assets/noodles.png';
import { searchDish } from '../api/zomatoApi';
import { useNavigate } from 'react-router-dom';


const FoodSelection = () => {
  // Food items data array

  const navigate = useNavigate();


  const foodItems = [
    {
      id: 1,
      name: 'Pizza',
      image: pizza, // Update with your actual image paths
      alt: 'Delicious pizza with toppings'
    },
    {
      id: 2,
      name: 'Burger',
      image: burger,
      alt: 'Cheeseburger with fresh vegetables'
    },
    {
      id: 3,
      name: 'Biryani',
      image: biryani,
      alt: 'Aromatic rice dish with herbs'
    },
    {
      id: 4,
      name: 'Rolls',
      image: rolls,
      alt: 'Wrapped rolls on wooden plate'
    },
    {
      id: 5,
      name: 'Thali',
      image: thali,
      alt: 'Indian thali with multiple dishes'
    },
    {
      id: 6,
      name: 'Thali Special',
      image: thali,
      alt: 'Special thali with variety of dishes'
    },
    {
      id: 7,
      name: 'Noodles',
      image: noodles,
      alt: 'Stir-fried noodles with vegetables'
    },
    {
      id: 8,
      name: 'Special Biryani',
      image: biryani,
      alt: 'Special biryani with garnish'
    }
  ];


  const handleItemClick = async(name)=>{
    console.log(name);
    const data = await searchDish(name)
    console.log(data);

    navigate("/search" , { state: { data } })

  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">What's on your mind?</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {foodItems.map((food) => (
          <div onClick={()=>(handleItemClick(food.name))} key={food.id} className="flex flex-col items-center">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-2">
              <img 
                src={food.image || "../assets/pizza.png"} 
                alt={food.alt} 
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
            <p className="text-gray-600 text-center">{food.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodSelection;