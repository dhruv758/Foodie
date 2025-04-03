import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CartFooter = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  return (
    <div className="flex justify-between items-center p-4">
      <button className="bg-yellow-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold">
        Initiate Poll
      </button>

      <div className="relative ml-70">
        <DatePicker
          selected={startTime}
          onChange={(date) => setStartTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Start Time"
          dateFormat="h:mm aa"
          popperPlacement="top"
          customInput={<button className="border border-gray-400 text-gray-600 px-4 py-2 rounded-lg">{startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "Start Time"}</button>}
        />
      </div>

      <div className="relative">
        <DatePicker
          selected={endTime}
          onChange={(date) => setEndTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="End Time"
          dateFormat="h:mm aa"
          popperPlacement="top"
          customInput={<button className="border border-gray-400 text-gray-600 px-4 py-2 rounded-lg">{endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "End Time"}</button>}
        />
      </div>
    </div>
  );
};

export default CartFooter;