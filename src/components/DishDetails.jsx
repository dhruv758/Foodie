import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function DishDetails({ selectedDishData, onSelectionChange, selectedUsers }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!selectedDishData) return null;

  const handleUserSelect = (user) => {
    // Notify parent component with the selected user
    onSelectionChange([user]);
  };

  // Filter users based on search term
  const filteredUsers = selectedDishData.users.filter(user => 
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:max-w-md w-full sm:mx-8 mt-2">
      {/* Search Input */}
      <Input 
        type="search" 
        placeholder="Search users..." 
        className="w-full mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* User List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filteredUsers.map((user, index) => (
          <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
            <Checkbox 
              id={`user-${index}`}
              checked={selectedUsers.includes(user)}
              onCheckedChange={() => handleUserSelect(user)}
            />
            <label htmlFor={`user-${index}`} className="text-sm font-medium">{user}</label>
          </div>
        ))}
      </div>

      {/* Total Selections */}
      <div className="pt-2 border-t mt-3">
        <p className="text-sm text-gray-500">
          Total Selections: <span className="font-semibold">{selectedUsers.filter(user => selectedDishData.users.includes(user)).length} / {selectedDishData.users.length}</span>
        </p>
      </div>
    </div>
  );
}

// older version

// import React, { useState, useEffect } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";

// export default function DishDetails({ selectedDishData, onSelectionChange }) {
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   useEffect(() => {
//     // Reset selected users when a new dish is selected
//     setSelectedUsers([]);
//   }, [selectedDishData]);

//   if (!selectedDishData) return null;

//   const handleUserSelect = (user) => {
//     setSelectedUsers((prevSelected) => {
//       const newSelection = prevSelected.includes(user)
//         ? prevSelected.filter((selectedUser) => selectedUser !== user)
//         : [...prevSelected, user];

//       // Notify parent component with the updated list
//       onSelectionChange(newSelection);
//       return newSelection;
//     });
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 sm:max-w-md w-full sm:mx-8 mt-2">
//       {/* Search Input */}
//       <Input type="search" placeholder="Search users..." className="w-full mb-2" />

//       {/* User List */}
//       <div className="space-y-2 max-h-[300px] overflow-y-auto">
//         {selectedDishData.users.map((user, index) => (
//           <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
//             <Checkbox 
//               id={`user-${index}`}
//               checked={selectedUsers.includes(user)}
//               onCheckedChange={() => handleUserSelect(user)}
//             />
//             <label htmlFor={`user-${index}`} className="text-sm font-medium">{user}</label>
//           </div>
//         ))}
//       </div>

//       {/* Total Selections */}
//       <div className="pt-2 border-t mt-3">
//         <p className="text-sm text-gray-500">
//           Total Selections: <span className="font-semibold">{selectedUsers.length} / {selectedDishData.users.length}</span>
//         </p>
//       </div>
//     </div>
//   );
// }



// oldest version

// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";

// export default function DishDetails({ selectedDishData }) {
//   if (!selectedDishData) return null;

//   return (
//     <div className="bg-white rounded-lg shadow-md p-8 sm:p-6 max-w-md sm:mx-8 sm:mt-4 mt-2">
//       {/* Search Input */}
//       <Input type="search" placeholder="Search users..." className="w-full mb-2" />

//       {/* User List */}
//       <div className="space-y-2 max-h-[300px] overflow-y-auto">
//         {selectedDishData.users.map((user, index) => (
//           <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
//             <Checkbox id={`user-${index}`} />
//             <label htmlFor={`user-${index}`} className="text-sm font-medium">{user}</label>
//           </div>
//         ))}
//       </div>

//       {/* Total Selections */}
//       <div className="pt-2 border-t mt-3">
//         <p className="text-sm text-gray-500">
//           Total Selections: <span className="font-semibold">{selectedDishData.users.length}</span>
//         </p>
//       </div>
//     </div>
//   );
// }
