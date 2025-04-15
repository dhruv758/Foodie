import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function DishDetails({ selectedDishData, onSelectionChange, selectedUsers }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!selectedDishData) return null;

  const handleUserSelect = (user) => {
    onSelectionChange([user]);
  };

  // Format a username to look more presentable
  const formatUsername = (username) => {
    if (!username) return "";
    
    // Split by dot or underscore
    const parts = username.split(/[._]/);
    
    // Capitalize first letter of each part
    return parts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(" ");
  };

  // Ensure that user and user.username exist to avoid errors.
  const filteredUsers = selectedDishData.users.filter(user =>
    user &&
    user.username &&
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      {/* Header */}
      <h2 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
        <span className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </span>
        Users who voted for {selectedDishData.name}
      </h2>
      
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <Input 
          type="search" 
          placeholder="Search users..." 
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User List - dynamic height */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto border border-gray-100 rounded-md p-2">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No users voted for this dish</p>
        ) : (
          filteredUsers.map((user, index) => (
            <div 
              key={index} 
              className={`flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md transition-colors ${
                selectedUsers.some(selected => selected.user_id === user.user_id) 
                  ? 'bg-[#1ac073]/10' 
                  : ''
              }`}
            >
              <Checkbox 
                id={`user-${index}`}
                checked={selectedUsers.some(selected => selected.user_id === user.user_id)}
                onCheckedChange={() => handleUserSelect(user)}
                className="h-4 w-4"
              />
              <div className="flex items-center space-x-2 flex-1">
                <label 
                  htmlFor={`user-${index}`} 
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {formatUsername(user.username)}
                </label>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total Selections */}
      <div className="pt-4 border-t mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Total Votes: <span className="font-semibold">{selectedDishData.users.length}</span>
        </p>
        <p className="text-sm text-gray-600">
          Selected:{" "}
          <span className="font-semibold text-black">
            {selectedUsers.filter(user => 
              selectedDishData.users.some(item => item.user_id === user.user_id)
            ).length}
          </span>
          <span className="text-gray-400"> / {selectedDishData.users.length}</span>
        </p>
      </div>
    </div>
  );
}
