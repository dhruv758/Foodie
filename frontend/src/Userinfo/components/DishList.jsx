export default function DishList({ dishes, selectedDish, setSelectedDish }) {
  return (
    <div className="bg-white border border-gray-300 shadow-sm rounded-lg p-3 sm:p-4 lg:p-6">
      <div className="flex flex-wrap justify-start gap-2 sm:gap-3 lg:gap-4">
        {dishes.map((dish) => (
          <button
            key={dish.id}
            onClick={() => setSelectedDish(dish.id)}
            className={`
              h-8 sm:h-9 lg:h-10 font-medium
              border-2 rounded-[20px] 
              px-2 sm:px-3 lg:px-4 py-0 sm:py-1 lg:py-1
              flex items-center justify-center cursor-pointer text-center
              transition-colors duration-200
              text-xs sm:text-sm lg:text-base
              ${selectedDish === dish.id 
                ? "bg-[#1ac073] border-[#1ac073] text-white hover:bg-[#18b66b]" 
                : "border-gray-400 hover:bg-gray-100"
              }`}
          >
            <span className="whitespace-nowrap">{dish.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
