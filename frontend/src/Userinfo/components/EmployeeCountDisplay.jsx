import React from "react";

export default function EmployeeCountDisplay({ dishes, selectedUsers }) {
  const totalEmployees = dishes.reduce((total, dish) => total + dish.users.length, 0);
  const employeesLeft = totalEmployees - selectedUsers.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6" style={{ height: 'fit-content' }}>
      <h3 className="text-lg font-medium mb-4 text-gray-800">Employee Summary</h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1ac073]/10 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Total Employees</p>
          <p className="text-2xl font-bold text-[#1ac073]">{totalEmployees}</p>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Employees Left</p>
          <p className="text-2xl font-bold text-red-600">{employeesLeft}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Selected: <span className="font-semibold text-black">{selectedUsers.length}</span> employees
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-[#1ac073] h-2.5 rounded-full" 
            style={{ width: `${(selectedUsers.length / totalEmployees) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
