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
          `http://localhost:3000/api/poll/summary/${pollId}`
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
    console.log(name);
    try {
      const res = await fetch("http://localhost:3000/done", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      console.log(res);
      if (res.status == 200) {
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
      <div className="max-w-3xl mx-auto p-6 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Poll Summary</h1>
          <Button
            variant="secondary"
            onClick={() => navigate(`/poll/${pollId}/users`)}
            className="bg-[#1AC073] text-white px-6 py-2 cursor-pointer text-lg rounded-full hover:bg-green-700 transition duration-300"
          >
            User Info
          </Button>
        </div>

        <div className="space-y-4">
          {summary.options.map((opt, i) => (
            <div
              key={i}
              className="border p-5 rounded-xl shadow-md bg-white flex justify-between items-center transition transform hover:scale-105"
            >
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {opt.name}
                </p>
                <p className="text-lg font-bold text-green-600">
                  {opt.vote_count} votes
                </p>
              </div>

              {/* only show buttons if opt.url is truthy */}
              {opt.url && (
                <div className="flex items-center">
                  <a
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-orange-600 transition duration-200 shadow-md ml-4"
                  >
                    Swiggy
                  </a>
                  <Button
                    variant="secondary"
                    onClick={() => handleArrivedAtOffice(opt.name)}
                    disabled={clickedNames.includes(opt.name)} // Disable if already clicked
                    className={`px-4 py-2 rounded-full font-semibold transition duration-200 shadow-md ml-4 
        ${
          clickedNames.includes(opt.name)
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }
    `}
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
