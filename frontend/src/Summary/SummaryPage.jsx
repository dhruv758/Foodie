import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "../HomePage/components/HomeNavbar";
import { HandHelping } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const SummaryPage = () => {
  const { pollId } = useParams();
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();
  const [clickedNames, setClickedNames] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_PRODUCTOION_URL}/api/poll/summary/${pollId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch summary");
        }
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    const savedClickedNames = localStorage.getItem(`clickedNames_${pollId}`);
    if (savedClickedNames) {
      setClickedNames(JSON.parse(savedClickedNames));
    }

    fetchSummary();
  }, [pollId]);

  const handleArrivedAtOffice = async (name) => {
    // Add confirmation dialog
    const isConfirmed = window.confirm(`Are you sure "${name}" has arrived at the office?`);
    
    // Only proceed if user confirmed
    if (!isConfirmed) {
      return; // Exit the function if user cancels
    }
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_PRODUCTOION_URL}/done`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (res.status === 200) {
        toast.success("Message has been sent to Slack");
        const updatedClickedNames = [...clickedNames, name];
        setClickedNames(updatedClickedNames);
        localStorage.setItem(
          `clickedNames_${pollId}`,
          JSON.stringify(updatedClickedNames)
        );
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Something went wrong");
    }
  };

  if (!summary)
    return <p className="p-6 text-center text-gray-700">Loading...</p>;

  return (
    <>
      <ToastContainer />
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-black">Poll Summary</h1>
          <Button
            variant="secondary"
            onClick={() => navigate(`/poll/${pollId}/users`)}
            className="bg-[#1AC073] text-white px-4 py-2 sm:px-6 text-sm sm:text-lg rounded-full hover:bg-green-700 transition duration-300"
          >
            User Info
          </Button>
        </div>

        <div className="space-y-4">
          {summary.options.map((opt, i) => (
            <div
              key={i}
              className="border p-4 rounded-xl shadow-md bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:scale-[1.02] transition-transform"
            >
              <div className="flex-1">
                <p className="text-lg sm:text-xl font-semibold text-gray-800">
                  {opt.name}
                </p>
                <p className="text-base sm:text-lg font-bold text-green-600">
                  {opt.vote_count} votes
                </p>
              </div>

              {opt.url && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
                  <a
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-orange-500 text-white px-4 py-2 text-sm sm:text-base rounded-full font-semibold hover:bg-orange-600 transition duration-200 shadow-md"
                  >
                    Swiggy
                  </a>
                  <Button
                    variant="secondary"
                    onClick={() => handleArrivedAtOffice(opt.name)}
                    disabled={clickedNames.includes(opt.name)}
                    className={`w-full sm:w-auto text-sm cursor-pointer sm:text-base px-4 py-2 rounded-full font-semibold shadow-md transition duration-200 ${
                      clickedNames.includes(opt.name)
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {clickedNames.includes(opt.name)
                      ? "Already Arrived"
                      : "Arrived At Office"}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SummaryPage;
