import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/components/ui/button';
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

const CartFooter = ({ cartItems, onPollInitiated }) => {
  const [startTime, setStartTime] = useState(new Date());
  const navigate = useNavigate();
  const { emptyCart } = useCart();
  const [endTime, setEndTime] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null);

  const handleStartTimeChange = (date) => {
    setStartTime(date);
    if (endTime && date && endTime <= new Date(date.getTime() + 5 * 60000)) {
      setEndTime(null);
    }
  };

  const handleEndTimeChange = (date) => {
    if (!startTime || (date && date > new Date(startTime.getTime() + 5 * 60000))) {
      setEndTime(date);
    }
  };

  const getMinEndTime = () => {
    if (!startTime) return undefined;
    const minEnd = new Date(startTime);
    minEnd.setMinutes(minEnd.getMinutes() + 5);
    return minEnd;
  };

  const getMaxEndTime = () => {
    const maxEnd = new Date();
    maxEnd.setHours(23, 59, 59, 999);
    return maxEnd;
  };

  const handleInitiatePoll = async () => {
    if (!endTime || cartItems.length === 0) {
      setStatusType("error");
      setStatusMessage("❌ Please select an end time and make sure the cart has items.");
      setTimeout(() => {
        setStatusMessage(null);
        setStatusType(null);
      }, 5000);
      return;
    }

    const pollData = {
      question: "Food Poll",
      choices: cartItems.map(item => {
        // build the URL-safe restaurant name
        const urlName = item.restaurant
          .toLowerCase()
          .replace(/\s+/g, '-');
    
        return {
          // if you really want a backslash, use '\\', otherwise use '/' or whatever separator you prefer
          name: `${item.name} / ${item.restaurant}`,
          id: `d21d1+${item.id}`,
          url: `https://www.swiggy.com/city/noida-1/${urlName}-rest${item.restaurantId}`
        };
      }),
      startDateTime: new Date().toISOString(),
      endDateTime: new Date(endTime).toISOString()
    };

    try {
      const apiUrl = `${import.meta.env.VITE_API_PRODUCTOION_URL}/poll-start`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pollData),
        mode: 'cors',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Poll started:", result);

      // Comment or remove this line to prevent emptying the cart
      emptyCart();

      setStatusType("success");
      navigate("/polls");
      setStatusMessage(`✅ Poll started successfully!`);

      setTimeout(() => {
        setStatusMessage(null);
        setStatusType(null);
        if (typeof onPollInitiated === "function") {
          onPollInitiated();
        }
      }, 1500);

    } catch (error) {
      console.error("❌ Failed to send poll:", error);
      setStatusType("error");
      setStatusMessage("❌ Failed to start poll.");
      setTimeout(() => {
        setStatusMessage(null);
        setStatusType(null);
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 p-2 sm:p-4">
      {/* Mobile layout - stack vertically */}
      <div className="flex flex-col sm:flex-row w-full sm:justify-between sm:items-center gap-2">
        <div className="flex justify-between w-full sm:w-auto gap-2">
          <div className="w-1/2 sm:w-auto">
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
                <Button variant="outline" className="text-gray-600 w-full text-xs sm:text-sm">
                  {startTime
                    ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                    : "Start Time"}
                </Button>
              }
            />
          </div>

          <div className="w-1/2 sm:w-auto">
            <DatePicker
              selected={endTime}
              onChange={handleEndTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="End Time"
              dateFormat="h:mm aa"
              minTime={getMinEndTime()}
              maxTime={getMaxEndTime()}
              disabled={!startTime}
              popperPlacement="top"
              customInput={
                <Button
                  variant="outline"
                  className={`w-full text-xs sm:text-sm ${!startTime ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600'}`}
                  disabled={!startTime}
                >
                  {endTime
                    ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                    : "End Time"}
                </Button>
              }
            />
          </div>
        </div>

        <Button
          className="bg-[#F3BA00] hover:bg-amber-600 text-white w-full sm:w-auto text-sm mt-2 sm:mt-0"
          onClick={handleInitiatePoll}
        >
          Initiate Poll
        </Button>
      </div>

      {statusMessage && (
        <div className={`text-xs sm:text-sm ${statusType === 'success' ? 'text-green-600' : 'text-red-600'} w-full text-center`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default CartFooter;
