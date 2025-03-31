import React from "react";

export default function EmployeeCountDisplay({ dishes, selectedUsers }) {
  // Total number of employees (unique users across all dishes)
  const totalEmployees = dishes.reduce((total, dish) => total + dish.users.length, 0);

  // Calculate employees left (total employees minus selected employees)
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

// older version

// export default function EmployeeCountDisplay({ selectedDish, selectedUsers }) {
//     if (!selectedDish) return null; // Hide if no dish is selected
  
//     const totalEmployees = selectedDish.users.length;
//     const employeesLeft = totalEmployees - selectedUsers.length;
  
//     return (
//       <div className="bg-white rounded-lg shadow-md p-4 max-w-xs sm:mx-8 sm:mt-4 mt-2">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="text-center">
//             <p className="text-sm text-gray-500">Total Employees</p>
//             <p className="text-xl font-bold text-blue-600">{totalEmployees}</p>
//           </div>
//           <div className="text-center">
//             <p className="text-sm text-gray-500">Employees Left</p>
//             <p className="text-xl font-bold text-red-600">{employeesLeft}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
  