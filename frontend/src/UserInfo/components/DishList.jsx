import { Button } from "@/components/ui/button";

export default function DishList({ dishes, selectedDish, setSelectedDish }) {
  return (
    <div className="bg-white border border-gray-300 shadow-sm  rounded-lg p-4 sm:p-6 sm:mx-8">

      <div className="grid grid-cols-3 sm:grid-cols-8 m-0.5 sm:m-4 gap-3 sm:gap-2 lg:gap-6">
        {dishes.map((dish) => (
          <Button
            key={dish.id}
            variant={selectedDish === dish.id ? "default" : "outline"}
            onClick={() => setSelectedDish(dish.id)}
            className="w-full max-w-[150px] h-auto min-h-[44px] 
                       flex flex-col items-center justify-center text-center 
                       text-xs sm:text-sm font-semibold 
                       border-2 border-[#008BA1] rounded-[20px] 
                       px-2 py-0.5 sm:px-4 sm:py-2 leading-tight"
          >
            <span className="whitespace-normal break-words">{dish.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
