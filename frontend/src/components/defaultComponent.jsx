import React from 'react';

const DefaultComponent = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-4">The page you're trying to access doesn't exist or you are not authorized to view it.</p>
    </div>
  );
};

export default DefaultComponent;
