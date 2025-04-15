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
    <div className="bg-white rounded-lg shadow-md p-6 sm:max-w-md w-full sm:mx-8 mt-2">
      {/* Header */}
      <h2 className="text-lg font-medium mb-3 text-black">
        Users who voted for {selectedDishData.name}
      </h2>
      
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
        {filteredUsers.length === 0 ? (
          <p className="text-center text-black py-4">No users voted for this dish</p>
        ) : (
          filteredUsers.map((user, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md">
              <Checkbox 
                id={`user-${index}`}
                checked={selectedUsers.some(selected => selected.user_id === user.user_id)}
                onCheckedChange={() => handleUserSelect(user)}
              />
              <label htmlFor={`user-${index}`} className="text-sm font-medium">
                {formatUsername(user.username)}
              </label>
            </div>
          ))
        )}
      </div>

      {/* Total Selections */}
      <div className="pt-2 border-t mt-3">
        <p className="text-sm text-black">
          Total Votes: <span className="font-semibold">{selectedDishData.users.length}</span>
        </p>
        <p className="text-sm text-black">
          Selected:{" "}
          <span className="font-normal">
            {selectedUsers.filter(user => 
              selectedDishData.users.some(item => item.user_id === user.user_id)
            ).length} / {selectedDishData.users.length}
          </span>
        </p>
      </div>
    </div>
  );
}