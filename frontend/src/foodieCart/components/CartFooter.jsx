import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@/components/ui/button';
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

const CartFooter = ({ cartItems, onPollInitiated }) => {
  const [startTime, setStartTime] = useState(new Date());
  const navigate = useNavigate();
  const {emptyCart} =useCart();
  const [endTime, setEndTime] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null);

  const handleStartTimeChange = (date) => {
    setStartTime(date);
    if (endTime && date && endTime >= date) {
      setEndTime(null);
    }
  };

  const handleEndTimeChange = (date) => {
    if (!startTime || (date && date > startTime)) {
      setEndTime(date);
    }
  };

  const getMinEndTime = () => {
    if (!startTime) return undefined;
    const minEnd = new Date(startTime);
    minEnd.setMinutes(minEnd.getMinutes() + 15);
    return minEnd;
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
      question:"Food Poll ",
      choices: cartItems.map(item => ({
        name: item.name,
        id: `d21d1+${item.id}`
      })),
      startDateTime: new Date().toISOString(),
      endDateTime: new Date(endTime).toISOString()  
    };

    try {
      const apiUrl = "http://localhost:3000/poll-start";
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
      emptyCart();
      setStatusType("success");
      navigate("/polls")
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
    <div className="flex flex-col items-start gap-2 p-4">
      <div className="flex w-full justify-between items-center">
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
            minTime={getMinEndTime()}
            maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
            disabled={!startTime}
            popperPlacement="top"
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

        <Button
          className="bg-[#F3BA00] hover:bg-amber-600 text-white"
          onClick={handleInitiatePoll}
        >
          Initiate Poll
        </Button>
      </div>

      {statusMessage && (
        <div className={`text-sm ${statusType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default CartFooter;
