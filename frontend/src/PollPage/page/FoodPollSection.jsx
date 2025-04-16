import { useEffect, useState } from "react";
import { Timer, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FoodPollSection = () => {
  const [polls, setPolls] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const fetchPolls = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/poll/all");
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

  const sortedPolls = [...polls].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const activePolls = sortedPolls.filter(
    (p) => p.status === "active" && new Date(p.expires_at) > currentTime
  );
  const donePolls = sortedPolls.filter(
    (p) => new Date(p.expires_at) <= currentTime
  );

  const getCardStyle = (status) => {
    const styles = {
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
    const message =
      status === "active" ? "What you want to order?" : "Now you can order";

    return (
      <div
        key={poll._id}
        onClick={() => status === "closed" && navigate(`/summary/${poll._id}`)}
        className={`rounded-2xl p-4 shadow-lg border ${getCardStyle(
          status
        )} cursor-pointer h-fit`}
      >
        {/* Date left, Time right */}
        <div className="flex justify-between mb-2">
          <p className="text-l text-gray-800 font-semibold">
            {formatDate(poll.expires_at)}
          </p>
          <p className="text-l text-gray-800 font-semibold">
            {formatTime(poll.expires_at)}
          </p>
        </div>

        {/* White inner box */}
        <div className="bg-white rounded-lg px-6 py-5 shadow border border-gray-200">
          <p className="text-black font-medium text-base mb-4">{message}</p>
          <div className="grid grid-cols-2 gap-3">
            {poll.options.map((opt, i) => (
              <div
                key={i}
                className="flex justify-between items-center border border-gray-400 bg-gray-100 text-black text-base font-medium px-4 py-2 rounded-full h-10 overflow-hidden"
              >
                <span className="truncate max-w-[70%]">
                  {opt.name.length > 6
                    ? opt.name.slice(0, 6) + "..."
                    : opt.name}
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
    <div className="flex flex-col gap-12 mt-10 ">
      {/* In Progress Section */}
      <div>
        {activePolls.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Timer className="h-5 w-5 text-[#178226]" />
              <h2 className="text-xl font-bold text-[#178226]">In Progress</h2>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {activePolls.map((poll) => (
                <div key={poll._id} className="break-inside-avoid">
                  {renderPollCard(poll, "active")}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-black font-semibold text-lg">No poll available</p>
        )}
      </div>

      {/* Done Section */}
      <div>
        {donePolls.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <CheckCheck className="h-5 w-5 text-[#C61B3E]" />
              <h2 className="text-xl font-bold text-[#C61B3E]">Done</h2>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {donePolls.map((poll) => (
                <div key={poll._id} className="break-inside-avoid">
                  {renderPollCard(poll, "closed")}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-black font-semibold text-lg">
              No votes available.
            </p>
            {activePolls.length > 0 && (
              <p className="text-[#178226] font-semibold text-lg mt-4">
                The voting lines are active.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FoodPollSection;
