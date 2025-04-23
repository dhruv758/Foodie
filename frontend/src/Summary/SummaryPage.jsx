import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "../HomePage/components/HomeNavbar";

const SummaryPage = () => {
    const { pollId } = useParams();
    const [summary, setSummary] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/poll/summary/${pollId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch summary');
                }
                const data = await res.json();
                setSummary(data);
            } catch (err) {
                console.error("Error fetching summary:", err);
            }
        };

        fetchSummary();
    }, [pollId]);

    if (!summary) return <p className="p-6 text-center text-gray-700">Loading...</p>;

    return (
        <>
            <Header />
            <div className="max-w-3xl mx-auto p-6 mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-black">
                        Poll Summary
                    </h1>
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
                                <p className="text-xl font-semibold text-gray-800">{opt.name}</p>
                                <p className="text-lg font-bold text-green-600">{opt.vote_count} votes</p>
                            </div>
                            <div className="flex items-center">
                                <a
                                    href={"https://www.swiggy.com/"} // fallback link
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-orange-600 transition duration-200 shadow-md ml-4"
                                >
                                    Swiggy
                                </a>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        // Add the logic for Done button action
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-200 shadow-md ml-4"
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SummaryPage;
