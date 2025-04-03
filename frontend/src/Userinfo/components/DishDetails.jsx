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