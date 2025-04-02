import { useState } from "react";
// import Navbar from "./components/Navbar";
import HomeNavbar from "../../HomePage/components/HomeNavbar";
import DishList from "../components/DishList";
import DishDetails from "../components/DishDetails";
import EmployeeCountDisplay from "../components/EmployeeCountDisplay";

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

function UserInfo() {
  const [selectedDish, setSelectedDish] = useState(null);
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
      <HomeNavbar/>

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



export default UserInfo;

