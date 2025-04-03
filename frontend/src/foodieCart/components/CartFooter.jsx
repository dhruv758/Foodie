import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CartFooter = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const handleStartTimeChange = (date) => {
    setStartTime(date);
    // Reset endTime if it's before or equal to the new startTime
    if (endTime && date && endTime <= date) {
      setEndTime(null);
    }
  };

  const handleEndTimeChange = (date) => {
    // Only set endTime if it's after startTime
    if (!startTime || (date && startTime && date > startTime)) {
      setEndTime(date);
    }
  };

  // Function to get the next time slot after startTime
  const getMinEndTime = () => {
    if (!startTime) return undefined;
    const nextTime = new Date(startTime);
    nextTime.setMinutes(nextTime.getMinutes() + 15);
    return nextTime;
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div className="relative">
        <DatePicker
          selected={startTime}
          onChange={handleStartTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Start Time"
          dateFormat="h:mm aa"
          popperPlacement="top"
          customInput={
            <button className="border border-gray-400 text-gray-600 px-4 py-2 rounded-lg">
              {startTime 
                ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) 
                : "Start Time"}
            </button>
          }
        />
      </div>

      <div className="relative mr-70">
        <DatePicker
          selected={endTime}
          onChange={handleEndTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="End Time"
          dateFormat="h:mm aa"
          popperPlacement="top"
          minTime={getMinEndTime()}
          maxTime={new Date().setHours(23, 59, 59, 999)}
          disabled={!startTime} // Disable until startTime is selected
          customInput={
            <button 
              className={`border border-gray-400 px-4 py-2 rounded-lg ${
                !startTime ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'
              }`}
              disabled={!startTime}
            >
              {endTime 
                ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) 
                : "End Time"}
            </button>
          }
        />
      </div>

      <button className="bg-yellow-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold">
        Initiate Poll
      </button>
    </div>
  );
};

export default CartFooter;