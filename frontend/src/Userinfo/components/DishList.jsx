import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DishList({ dishes, selectedDish, setSelectedDish }) {
  return (
    <TooltipProvider>
      <div className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 sm:p-6 mx-2 sm:mx-8">
      <div className="flex flex-wrap justify-start gap-4 sm:gap-6 lg:gap-10">

          {dishes.map((dish) => (
            <Tooltip key={dish.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDish(dish.id)}
                  className={`min-w-[90px] sm:min-w-[110px] max-w-[150px] 
              h-11 sm:h-12 text-xs sm:text-sm font-semibold 
              border-2 border-gray-400 rounded-[20px] 
              px-2 py-1 sm:px-3 sm:py-2 leading-tight 
              flex items-center justify-center text-center
              ${selectedDish === dish.id ? "bg-green-100 border-green-600" : ""}`}
                >
                  <span className="truncate w-full">
                    {dish.name.length > 10 ? dish.name.slice(0, 10) + "..." : dish.name}
                  </span>
                </Button>

              </TooltipTrigger>
              <TooltipContent side="top">
                {dish.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
