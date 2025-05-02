import { useEffect, useState } from "react";
import { Timer, CheckCheck, CalendarClock, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FoodPollSection = () => {
  const [polls, setPolls] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openDates, setOpenDates] = useState({});
  const navigate = useNavigate();

  const fetchPolls = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_PRODUCTOION_URL}/api/poll/all`);
      const data = await res.json();
      setPolls(data);
    } catch (err) {
      console.error("Error fetching polls:", err);
    }
  };

  useEffect(() => {
    fetchPolls();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const scheduledPolls = polls.filter(
    (p) => p.scheduleType === "schedule" && new Date(p.startDateTime) > currentTime
  );

  const activePolls = polls.filter(
    (p) =>
      new Date(p.startDateTime || p.createdAt) <= currentTime &&
      new Date(p.endDateTime) > currentTime &&
      !p.isClosed
  );

  const donePolls = polls.filter(
    (p) => new Date(p.endDateTime) <= currentTime || p.isClosed
  );

  const donePollGroups = Object.entries(
    donePolls
      .sort((a, b) => new Date(b.endDateTime) - new Date(a.endDateTime))
      .reduce((acc, poll) => {
        const dateKey = new Date(poll.endDateTime).toDateString();
        acc[dateKey] = acc[dateKey] || [];
        acc[dateKey].push(poll);
        return acc;
      }, {})
  );

  useEffect(() => {
    if (donePollGroups.length > 0) {
      const [latestDate] = donePollGroups[0];
      setOpenDates({ [latestDate]: true });
    }
  }, [polls]);

  const toggleDate = (date) => {
    setOpenDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const getCardStyle = (status) => {
    const styles = {
      scheduled: "bg-blue-100 border-blue-300",
      active: "bg-[#9EE8A8] border-green-400",
      closed: "bg-[#F9BAB5] border-red-300",
    };
    return styles[status] || "bg-gray-50 border-gray-300";
  };

  const formatDate = (time) =>
    new Date(time).toLocaleDateString(undefined, { dateStyle: "medium" });

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString(undefined, { timeStyle: "short" });

  const renderPollCard = (poll, status) => {
    const messageMap = {
      scheduled: "Poll is scheduled",
      active: "What do you want to order?",
      closed: "Now you can order",
    };
  
    const handleDeletePoll = async (pollId) => {
      if (!window.confirm("Are you sure you want to delete this poll?")) return;
  
      try {
        const res = await fetch(`${import.meta.env.VITE_API_PRODUCTOION_URL}/api/polls/delete/${pollId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          alert("Poll deleted successfully!");
          fetchPolls();
        } else {
          alert("Failed to delete poll.");
        }
      } catch (err) {
        console.error("Error deleting poll:", err);
        alert("An error occurred while deleting poll.");
      }
    };
  
    return (
      <div
        key={poll._id}
        onClick={() =>
          status === "closed" ? navigate(`/summary/${poll._id}`) : null
        }
        className={`rounded-2xl p-4 shadow-lg border ${getCardStyle(status)} cursor-pointer h-fit relative`}
      >
        {/* Updated Header: Date, Time, Delete Button */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <p className="text-l text-gray-800 font-semibold">
              {formatDate(poll.endDateTime)}
            </p>
            <p className="text-l text-gray-800 font-semibold">
              {formatTime(poll.endDateTime)}
            </p>
          </div>

          {/* 🗑️ Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePoll(poll._id);
            }}
            className="text-red-600 hover:text-red-800 bg-white rounded-full p-1 shadow w-8 h-8 flex items-center justify-center ml-2"
            title="Delete Poll"
          >
            🗑️
          </button>
        </div>

        {/* Poll Content */}
        <div className="bg-white rounded-lg px-6 py-5 shadow border border-gray-200">
          <p className="text-black font-medium text-base mb-4">
            {messageMap[status]}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {poll.options.map((opt, i) => (
              <div
                key={i}
                className="flex justify-between items-center border border-gray-400 bg-gray-100 text-black text-base font-medium px-4 py-2 rounded-full h-10 overflow-hidden"
              >
                <span className="truncate max-w-[70%]">
                  {opt.name.length > 6 ? opt.name.slice(0, 6) + "..." : opt.name}
                </span>
                <span className="ml-1">{opt.vote_count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <div className="flex flex-col gap-12 mt-10">
      {/* Scheduled Polls */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CalendarClock className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-600">Scheduled</h2>
        </div>
        {scheduledPolls.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {scheduledPolls.map((poll) => (
              <div key={poll._id} className="break-inside-avoid">
                {renderPollCard(poll, "scheduled")}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-black font-semibold text-lg">
            No poll scheduled.
          </p>
        )}
      </div>

      {/* In Progress Polls */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Timer className="h-5 w-5 text-[#178226]" />
          <h2 className="text-xl font-bold text-[#178226]">In Progress</h2>
        </div>
        {activePolls.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {activePolls.map((poll) => (
              <div key={poll._id} className="break-inside-avoid">
                {renderPollCard(poll, "active")}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-black font-semibold text-lg">
            No poll available.
          </p>
        )}
      </div>

      {/* Done Polls */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCheck className="h-5 w-5 text-[#B71C1C]" />
          <h2 className="text-xl font-bold text-[#B71C1C]">Done</h2>
        </div>
        {donePollGroups.length > 0 ? (
          donePollGroups.map(([date, polls]) => (
            <div key={date} className="mb-6">
              <div
                onClick={() => toggleDate(date)}
                className="flex items-center justify-between cursor-pointer bg-gray-100 px-4 py-3 rounded-md shadow"
              >
                <h3 className="text-lg font-semibold text-gray-700">{date}</h3>
                {openDates[date] ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
              {openDates[date] && (
                <div className="flex flex-wrap gap-6 mt-4">
                  {polls.map((poll) => (
                    <div key={poll._id} className="w-full sm:w-[48%] lg:w-[30%]">
                      {renderPollCard(poll, "closed")}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-black font-semibold text-lg">
            The voting lines are still active.
          </p>
        )}
      </div>
    </div>
  );
};

export default FoodPollSection;
