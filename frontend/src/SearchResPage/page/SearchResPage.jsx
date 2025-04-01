import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { SectionHeader, FoodTypeSelector } from '../components/SectionHeader';
import FoodCard from '../components/FoodCart';
import { useLocation } from 'react-router-dom';

// const initialFoodData = [
//   { id: 1, name: 'Dominos', image: 'card.png', rating: 3.5, type: 'Veg' },
//   { id: 2, name: 'Dominos', image: 'img2.jpg', rating: 3.5, type: 'Non-Veg' },
//   { id: 3, name: 'Dominos', image: 'img1.jpg', rating: 3.5, type: 'Veg' },
//   { id: 4, name: 'Dominos', image: 'img1.jpg', rating: 3.5, type: 'Non-Veg' },
//   { id: 5, name: 'Dominos', image: 'img2.jpg', rating: 3.5, type: 'Veg' },
//   { id: 6, name: 'Dominos', image: 'img1.jpg', rating: 3.5, type: 'Non-Veg' },
//   { id: 7, name: 'Dominos', image: 'img2.jpg', rating: 3.5, type: 'Veg' },
//   { id: 8, name: 'Dominos', image: 'img1.jpg', rating: 3.5, type: 'Veg' },
//   { id: 9, name: 'Dominos', image: 'img2.jpg', rating: 3.5, type: 'Veg' },
// ];

const SearchResPage = () => {
  const location = useLocation();
  const data = location.state.data
  const [foods, setFoods] = useState(initialFoodData);
  const [cartItems, setCartItems] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  useEffect(()=>{
      setFoods(data);
  },[])


  const addToCart = (food) => {
    if (!cartItems.find((item) => item.id === food.id)) {
      setCartItems([...cartItems, food]);
    }
  };

  const removeFromCart = (foodId) => {
    setCartItems(cartItems.filter((item) => item.id !== foodId));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handlePlusClick = () => {
    alert('Plus button clicked! Add your functionality here.');
  };

  // Filter foods based on selected type
  const filteredFoods = selectedType
    ? foods.filter((food) => food.type.toLowerCase() === selectedType)
    : foods;

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <Header cartCount={cartItems.length} />
      <SectionHeader handlePlusClick={handlePlusClick} />
      {/* <FoodTypeSelector 
        selectedType={selectedType} 
        handleTypeSelect={handleTypeSelect} 
      /> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredFoods.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            cartItems={cartItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResPage;











// import React, { useEffect, useState } from 'react';
// import Header from '../components/Header';
// import { SectionHeader, FoodTypeSelector } from '../components/SectionHeader';
// import FoodCard from '../components/FoodCart';
// import { useLocation } from 'react-router-dom';



// const SearchResPage = () => {

//   const location = useLocation();
//   console.log(location.state.data);
//   const data = location.state.data;

//   const [foods, setFoods] = useState("");
//   const [cartItems, setCartItems] = useState([]);
//   const [selectedType, setSelectedType] = useState('');


//   useEffect(()=>{
//     setFoods(data);
//   },[])









//   // Filter foods based on selected type
//   // const filteredFoods = selectedType
//   //   ? foods.filter((food) => food.type.toLowerCase() === selectedType)
//   //   : foods;

//   return (
//     <div className="max-w-screen-xl mx-auto p-4">
//       <Header cartCount={cartItems.length} />
//       <SectionHeader handlePlusClick={handlePlusClick} />
//       {/* <FoodTypeSelector 
//         selectedType={selectedType} 
//         handleTypeSelect={handleTypeSelect} 
//       /> */}

//       {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {foods.map((food) => (
//           <FoodCard
//             key={food.id}
//             food={food}
//             cartItems={cartItems}
//             addToCart={addToCart}
//             removeFromCart={removeFromCart}
//           />
//         ))}
//       </div> */}
//     </div>
//   );
// };

// export default SearchResPage;





//   // const addToCart = (food) => {
//   //   if (!cartItems.find((item) => item.id === food.id)) {
//   //     setCartItems([...cartItems, food]);
//   //   }
//   // };

//   // const removeFromCart = (foodId) => {
//   //   setCartItems(cartItems.filter((item) => item.id !== foodId));
//   // };

//   // const handleTypeSelect = (type) => {
//   //   setSelectedType(type);
//   // };

//   // const handlePlusClick = () => {
//   //   alert('Plus button clicked! Add your functionality here.');
//   // };