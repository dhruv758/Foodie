import React from 'react';
import addButtonIcon from '../../assets/add-button.png';

const SectionHeader = ({ handlePlusClick }) => {
  return (
    <div className="flex justify-between items-center mb-4 mt-8">
      <h2 className="text-xl font-semibold">Top restaurant for Pizza</h2>
      <button
        onClick={handlePlusClick}
        className="bg-green-500 text-white font-semibold px-4 py-2 rounded-full flex items-center"
      >
        <img src={addButtonIcon} alt="Add" className="w-5 h-5 mr-2" />
        <span>Add New Item</span>
      </button>
    </div>
  );
};

// FoodTypeSelector component is removed

export { SectionHeader }; // Only export SectionHeader