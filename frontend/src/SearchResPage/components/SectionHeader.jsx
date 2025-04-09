import React from 'react';
import addButtonIcon from '../../assets/add-button.png';

const SectionHeader = ({ handlePlusClick }) => {
  return (
    <div className="flex justify-between items-center mb-4 mt-8">
      <h2 className="text-xl font-semibold">Top restaurant for Pizza</h2>
      {/* <button
        onClick={handlePlusClick}
        className="bg-green-500 text-white font-semibold px-4 py-2 rounded-full flex items-center"
      >
        <img src={addButtonIcon} alt="Add" className="w-5 h-5 mr-2" />
        <span>Add New Item</span>
      </button> */}
    </div>
  );
};

const FoodTypeSelector = ({ selectedType, handleTypeSelect }) => {
  return (
    <div className="flex space-x-2 mt-2 mb-4">
      <button
        className={`px-4 py-1 rounded-full ${selectedType === 'veg' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'}`}
        onClick={() => handleTypeSelect('veg')}
      >
        Veg
      </button>
      <button
        className={`px-4 py-1 rounded-full ${selectedType === 'non-veg' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}
        onClick={() => handleTypeSelect('non-veg')}
      >
        Non-Veg
      </button>
    </div>
  );
};

export { SectionHeader, FoodTypeSelector };