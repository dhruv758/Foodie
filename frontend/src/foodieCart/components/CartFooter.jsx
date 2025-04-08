import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/components/ui/button'; // Adjust path

const CartFooter = () => {
  const [startTime, setStartTime] = useState(new Date()); // Set default to current time
  const [endTime, setEndTime] = useState(null);

  const handleStartTimeChange = (date) => {
    setStartTime(date);
    if (endTime && date && endTime <= date) {
      setEndTime(null);
    }
  };

  const handleEndTimeChange = (date) => {
    if (!startTime || (date && startTime && date > startTime)) {
      setEndTime(date);
    }
  };

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
            <Button variant="outline" className="text-gray-600">
              {startTime 
                ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) 
                : "Start Time"}
            </Button>
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
          maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
          disabled={!startTime}
          customInput={
            <Button 
              variant="outline" 
              className={`${!startTime ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'}`}
              disabled={!startTime}
            >
              {endTime 
                ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) 
                : "End Time"}
            </Button>
          }
        />
      </div>

      <Button className="bg-yellow-500 hover:bg-amber-600 text-white">
        Initiate Poll
      </Button>
    </div>
  );
};

export default CartFooter;