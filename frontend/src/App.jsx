<<<<<<< HEAD
import { useState } from "react";
import Navbar from "./components/Navbar";
import DishList from "./components/DishList";
import DishDetails from "./components/DishDetails";
import EmployeeCountDisplay from "./components/EmployeeCountDisplay";

const dishes = [
  { id: 1, name: "Grilled Salmon", users: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"] },
  { id: 2, name: "Vegetarian Pasta", users: ["Emily Brown", "David Wilson", "Lisa Anderson"] },
  { id: 3, name: "Chicken Curry", users: ["Robert Taylor", "Amanda Martinez", "Chris Lee", "Maria Garcia", "Tom White"] },
  { id: 4, name: "Beef Tacos", users: ["Nina Clark", "Jason Adams", "Oliver Scott"] },
  { id: 5, name: "Caesar Salad", users: ["Linda Moore", "Peter Harris", "Sophia Young"] },
  { id: 6, name: "Spaghetti Bolognese", users: ["Charlotte Evans", "Daniel King", "Megan Lewis", "James Turner"] },
  { id: 7, name: "Lamb Chops", users: ["Ava Phillips", "Lucas Walker", "Jack Hall"] },
  { id: 8, name: "Vegetable Stir-Fry", users: ["Grace Carter", "Leo Nelson", "Zoe Mitchell", "Oscar Perez"] },
  { id: 9, name: "Shrimp Scampi", users: ["Ella Green", "Michael Harris", "Ella Thompson"] },
  { id: 10, name: "Margherita Pizza", users: ["Ethan Clark", "Ariana Rivera", "Olivia Adams"] }
];

function App() {
  const [selectedDish, setSelectedDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const selectedDishData = dishes.find((dish) => dish.id === selectedDish);

  const handleSelectionChange = (newSelectedUsers) => {
    setSelectedUsers(prev => {
      const updatedSelection = newSelectedUsers.reduce((acc, user) => {
        return acc.includes(user) 
          ? acc.filter(selectedUser => selectedUser !== user)
          : [...acc, user];
      }, prev);
      return updatedSelection;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="mb-4 mt-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Today's Menu Selection</h1>
      </div>
      <div>
        <DishList dishes={dishes} selectedDish={selectedDish} setSelectedDish={setSelectedDish} />
      </div>

      {selectedDishData && (
        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4 mt-6">
          <div className="w-full sm:w-auto sm:max-w-md mx-auto order-1 sm:order-none">
            <EmployeeCountDisplay 
              dishes={dishes}
              selectedUsers={selectedUsers} 
            />
          </div>

          <div className="w-full sm:w-auto sm:max-w-md mx-auto order-2 sm:order-none">
            <DishDetails 
              selectedDishData={selectedDishData} 
              onSelectionChange={handleSelectionChange}
              selectedUsers={selectedUsers}
            />
          </div>
        </div>
      )}
    </div>
  );
}



export default App;

// older version

// import { useState } from "react";
// import Navbar from "./components/Navbar";
// import DishList from "./components/DishList";
// import DishDetails from "./components/DishDetails";
// import EmployeeCountDisplay from "./components/EmployeeCountDisplay";
// const dishes = [
//   { id: 1, name: "Grilled Salmon", users: ["John Doe", "Jane Smith", "Mike Johnson"] },
//   { id: 2, name: "Vegetarian Pasta", users: ["Emily Brown", "David Wilson", "Lisa Anderson", "Sophia Young"] },
//   { id: 3, name: "Chicken Curry", users: ["Robert Taylor", "Amanda Martinez", "Chris Lee", "Maria Garcia"] },
//   { id: 4, name: "Beef Tacos", users: ["Nina Clark", "Jason Adams", "Oliver Scott", "James Turner"] },
//   { id: 5, name: "Caesar Salad", users: ["Linda Moore", "Peter Harris"] },
//   { id: 6, name: "Spaghetti Bolognese", users: ["Charlotte Evans", "Daniel King", "Megan Lewis"] },
//   { id: 7, name: "Lamb Chops", users: ["Ava Phillips", "Lucas Walker", "Jack Hall", "Tom White"] },
//   { id: 8, name: "Vegetable Stir-Fry", users: ["Grace Carter", "Leo Nelson", "Zoe Mitchell", "Oscar Perez"] },
//   { id: 9, name: "Shrimp Scampi", users: ["Ella Green", "Michael Harris", "Ella Thompson", "Olivia Adams"] },
//   { id: 10, name: "Margherita Pizza", users: ["Ethan Clark", "Ariana Rivera"] }
// ];


// function App() {
//   const [selectedDish, setSelectedDish] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   const selectedDishData = dishes.find((dish) => dish.id === selectedDish);

//   const handleSelectionChange = (newSelectedUsers) => {
//     setSelectedUsers(newSelectedUsers);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar */}
//       <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
//       {/* Title Section */}
//       <div className="mb-4 mt-4 text-center">
//         <h1 className="text-2xl font-bold text-gray-900">Today's Menu Selection</h1>
//       </div>

//       {/* Dish List Section */}
//       <div>
//         <DishList dishes={dishes} selectedDish={selectedDish} setSelectedDish={setSelectedDish} />
//       </div>
      
//       {/* Dish Details and Employee Count Section */}
//       {selectedDishData && (
//         <div className="flex flex-col sm:flex-row justify-center items-start gap-4 mt-6">
//           <DishDetails 
//             selectedDishData={selectedDishData} 
//             onSelectionChange={handleSelectionChange}
//           />
//           <EmployeeCountDisplay 
//             selectedDish={selectedDishData} 
//             selectedUsers={selectedUsers} 
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import { useState } from "react";
// import Navbar from "./components/Navbar";
// import DishList from "./components/DishList";
// import DishDetails from "./components/DishDetails";


// const dishes = [
//   { id: 1, name: "Grilled Salmon", users: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"] },
//   { id: 2, name: "Vegetarian Pasta", users: ["Emily Brown", "David Wilson", "Lisa Anderson"] },
//   { id: 3, name: "Chicken Curry", users: ["Robert Taylor", "Amanda Martinez", "Chris Lee", "Maria Garcia", "Tom White"] },
//   { id: 4, name: "Beef Tacos", users: ["Nina Clark", "Jason Adams", "Oliver Scott"] },
//   { id: 5, name: "Caesar Salad", users: ["Linda Moore", "Peter Harris", "Sophia Young"] },
//   { id: 6, name: "Spaghetti Bolognese", users: ["Charlotte Evans", "Daniel King", "Megan Lewis", "James Turner"] },
//   { id: 7, name: "Lamb Chops", users: ["Ava Phillips", "Lucas Walker", "Jack Hall"] },
//   { id: 8, name: "Vegetable Stir-Fry", users: ["Grace Carter", "Leo Nelson", "Zoe Mitchell", "Oscar Perez"] },
//   { id: 9, name: "Shrimp Scampi", users: ["Ella Green", "Michael Harris", "Ella Thompson"] },
//   { id: 10, name: "Margherita Pizza", users: ["Ethan Clark", "Ariana Rivera", "Olivia Adams"] }
// ];

// function EmployeeCountDisplay({ selectedDish, selectedUsers }) {
//   if (!selectedDish) return null;

//   const totalEmployees = selectedDish.users.length;
//   const employeesLeft = totalEmployees - selectedUsers.length;

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 sm:mx-8 mt-2">
//       <div className="grid grid-cols-2 gap-4">
//         <div className="text-center">
//           <p className="text-sm text-gray-500">Total Employees</p>
//           <p className="text-xl font-bold text-blue-600">{totalEmployees}</p>
//         </div>
//         <div className="text-center">
//           <p className="text-sm text-gray-500">Employees Left</p>
//           <p className="text-xl font-bold text-red-600">{employeesLeft}</p>
//         </div>
//       </div>
//     </div>
//   );
// }


// function App() {
//   const [selectedDish, setSelectedDish] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const selectedDishData = dishes.find((dish) => dish.id === selectedDish);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
//         {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 border-t border-gray-200"> */}
//         {/* Title Section */}
//         <div className="mb-4 mt-4">
//           <h1 className="text-2xl font-bold text-gray-900 text-center">Today's Menu Selection</h1>
//         </div>

//         {/* Dish List Section */}
//         <div>
//         <DishList dishes={dishes} selectedDish={selectedDish} setSelectedDish={setSelectedDish} />
//         </div>
          
//         {/* Dish Details Section */}
//         <div>
//           <DishDetails selectedDishData={selectedDishData} />
//         </div>

//       {/* </div> */}

//     </div>
//   );
// }

// export default App;
=======
import { Route, Routes } from "react-router-dom";
import SignInForm from "./Authentication/Page/SignInForm";
import Register from "./Authentication/Components/Register";
import Login from "./Authentication/Components/Login";
import ForgotPassword from "./Authentication/Components/forgotPassword/ForgotPassword";
import HomePage from "./HomePage/page/HomePage";
import SearchResPage from "./SearchResPage/page/SearchResPage";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignInForm />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route  path="/home" element={<HomePage/>}/>
        <Route  path="/search" element={<SearchResPage/>}/>

      </Routes>
    </>
  );
}

export default App;
>>>>>>> 66bc31d090053f54c3746288d979a600eb191cd9
