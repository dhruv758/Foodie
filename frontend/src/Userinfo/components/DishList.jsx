export default function DishList({ dishes, selectedDish, setSelectedDish }) {
  return (
    <div className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 sm:p-6 ">
      <div className="flex flex-wrap justify-start gap-4">
        {dishes.map((dish) => (
          <button
            key={dish.id}
            onClick={() => setSelectedDish(dish.id)}
            className={`
              h-10 sm:h-10  font-medium
              border-2 rounded-[20px] 
              px-4 py-1 sm:px-5 sm:py-2
              flex items-center justify-center cursor-pointer text-center
              transition-colors duration-200
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
