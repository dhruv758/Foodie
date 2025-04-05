import React from "react";
import Header from "@/SearchResPage/components/Header";
import addPoll from "../../assets/add-poll.svg";
import { useState, useEffect } from "react";
import { Plus, Trash2, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

function PollPage() {
  // Default state values
  const defaultState = {
    question: "",
    choices: [""],
    allowMultipleVotes: false,
    scheduleType: "sendNow",
    recurringType: "oneTime",
    selectedDays: [],
  };

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState(defaultState.question);
  const [choices, setChoices] = useState(defaultState.choices);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(
    defaultState.allowMultipleVotes
  );
  const [scheduleType, setScheduleType] = useState(defaultState.scheduleType);
  const [recurringType, setRecurringType] = useState(
    defaultState.recurringType
  );
  const [selectedDays, setSelectedDays] = useState(defaultState.selectedDays);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Reset state when dialog is closed
  useEffect(() => {
    if (!open) {
      setQuestion(defaultState.question);
      setChoices(defaultState.choices);
      setAllowMultipleVotes(defaultState.allowMultipleVotes);
      setScheduleType(defaultState.scheduleType);
      setRecurringType(defaultState.recurringType);
      setSelectedDays(defaultState.selectedDays);
    }
  }, [open]);

  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const handleRemoveChoice = (index) => {
    const newChoices = [...choices];
    newChoices.splice(index, 1);
    setChoices(newChoices);
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <>
      <div className="max-w-screen-xl mx-auto p-4">
        <Header />
        <div className="max-w-screen-xl mx-auto p-5">
          <div className="heading flex justify-between">
            <h1 className="text-2xl font-semibold">Polls</h1>
            <Dialog open={open} onOpenChange={setOpen} className="bg-white">
              <DialogTrigger asChild>
                <img
                  src={addPoll}
                  alt=""
                  className="w-10 h-10 cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5" />
                  <DialogTitle className="text-xl font-bold">
                    Create Poll
                  </DialogTitle>
                </div>

                {/* Make the content area scrollable */}
                <div className="space-y-4 overflow-y-auto pr-2">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Question</h3>
                    <Input
                      placeholder="Enter your question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>

                  <div className="flex">
                    <div
                      className="w-[20px] bg-gray-200 rounded-l-md mr-2 flex-shrink-0"
                      style={{
                        height: `${Math.max(100, 60 + choices.length * 50)}px`,
                      }}
                    />

                    <div className="flex-1 space-y-2">
                      {choices.map((choice, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder="Enter choice"
                            value={choice}
                            onChange={(e) =>
                              handleChoiceChange(index, e.target.value)
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveChoice(index)}
                            disabled={choices.length <= 1}
                          >
                            <Trash2 className="h-5 w-5 text-gray-500" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleAddChoice}
                      >
                        <Plus className="h-4 w-4" />
                        Add Choice
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowMultiple"
                      checked={allowMultipleVotes}
                      onCheckedChange={(checked) =>
                        setAllowMultipleVotes(checked)
                      }
                    />
                    <label
                      htmlFor="allowMultiple"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Allow multiple votes on this question
                    </label>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 2V5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 2V5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 8H21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <h3 className="text-lg font-medium">Schedule Delivery</h3>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm text-gray-500 mb-2">Schedule</h4>
                      <div className="grid grid-cols-2 gap-1 mb-4">
                        <Button
                          variant={
                            scheduleType === "sendNow" ? "default" : "outline"
                          }
                          className={cn(
                            "rounded-r-none",
                            scheduleType === "sendNow"
                              ? "bg-amber-400 hover:bg-amber-500 text-black"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          )}
                          onClick={() => setScheduleType("sendNow")}
                        >
                          Send Now
                        </Button>
                        <Button
                          variant={
                            scheduleType === "schedule" ? "default" : "outline"
                          }
                          className={cn(
                            "rounded-l-none",
                            scheduleType === "schedule"
                              ? "bg-amber-400 hover:bg-amber-500 text-black"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          )}
                          onClick={() => setScheduleType("schedule")}
                        >
                          Schedule
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {scheduleType === "schedule" && (
                          <div>
                            <h4 className="text-sm text-gray-500 mb-2">
                              Start
                            </h4>
                            <Input type="time" placeholder="Start Time" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm text-gray-500 mb-2">End</h4>
                          <Input type="time" placeholder="End Time" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">
                        Schedule Type
                      </h4>
                      <div className="grid grid-cols-2 gap-1 mb-4">
                        <Button
                          variant={
                            recurringType === "oneTime" ? "default" : "outline"
                          }
                          className={cn(
                            "rounded-r-none",
                            recurringType === "oneTime"
                              ? "bg-amber-400 hover:bg-amber-500 text-black"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          )}
                          onClick={() => setRecurringType("oneTime")}
                        >
                          One Time
                        </Button>
                        <Button
                          variant={
                            recurringType === "recurring"
                              ? "default"
                              : "outline"
                          }
                          className={cn(
                            "rounded-l-none",
                            recurringType === "recurring"
                              ? "bg-amber-400 hover:bg-amber-500 text-black"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          )}
                          onClick={() => setRecurringType("recurring")}
                        >
                          Recurring Poll
                        </Button>
                      </div>

                      {recurringType === "recurring" && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {days.map((day) => (
                            <Button
                              key={day}
                              variant="outline"
                              className={cn(
                                "px-4 py-2 h-10",
                                selectedDays.includes(day)
                                  ? "bg-amber-400 hover:bg-amber-500 text-black border-amber-400"
                                  : "bg-white hover:bg-gray-100"
                              )}
                              onClick={() => toggleDay(day)}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                    Send Poll
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default PollPage;
