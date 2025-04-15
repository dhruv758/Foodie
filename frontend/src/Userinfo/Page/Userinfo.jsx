import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../HomePage/components/HomeNavbar";
import DishList from "../components/DishList";
import DishDetails from "../components/DishDetails";
import EmployeeCountDisplay from "../components/EmployeeCountDisplay";

function UserInfo() {
  const { pollId } = useParams();
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoterData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/poll/${pollId}/voters`);
        if (!response.ok) {
          throw new Error('Failed to fetch voter data');
        }
        const data = await response.json();
        
        const formattedDishes = data.map(dish => ({
          id: dish.id,
          name: dish.name,
          users: dish.users
        }));
        
        setDishes(formattedDishes);
        setLoading(false);
        
        if (formattedDishes.length > 0 && !selectedDish) {
          setSelectedDish(formattedDishes[0].id);
        }
      } catch (err) {
        console.error("Error fetching voter data:", err);
        setError("Failed to load voter data. Please try again.");
        setLoading(false);
      }
    };

    if (pollId) {
      fetchVoterData();
    }
  }, [pollId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-lg font-medium text-black">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-lg font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-lg font-medium text-black">No data available for this poll.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-black">User Voting Information</h1>
        </div>
        
        <div className="mb-8">
          <DishList dishes={dishes} selectedDish={selectedDish} setSelectedDish={setSelectedDish} />
        </div>

        {selectedDishData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <EmployeeCountDisplay 
                dishes={dishes}
                selectedUsers={selectedUsers} 
              />
            </div>

            <div className="md:col-span-2">
              <DishDetails 
                selectedDishData={selectedDishData} 
                onSelectionChange={handleSelectionChange}
                selectedUsers={selectedUsers}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserInfo;
