import React from "react";

export default function EmployeeCountDisplay({ dishes, selectedUsers }) {
  const totalEmployees = dishes.reduce((total, dish) => total + dish.users.length, 0);
  const employeesLeft = totalEmployees - selectedUsers.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-xs sm:mx-8 sm:mt-4 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Employees</p>
          <p className="text-xl font-bold text-blue-600">{totalEmployees}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Employees Left</p>
          <p className="text-xl font-bold text-red-600">{employeesLeft}</p>
        </div>
      </div>
    </div>
  );
}
