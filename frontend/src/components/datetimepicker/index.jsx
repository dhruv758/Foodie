"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
 
export function DateTimePicker({ value, onChange, className }) {
  const [date, setDate] = React.useState(value);
  const [isOpen, setIsOpen] = React.useState(false);
 
  // Update internal state when prop changes
  React.useEffect(() => {
    setDate(value);
  }, [value]);
  
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      const newDate = selectedDate;
      if (date) {
        // Preserve time from existing date
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
      }
      setDate(newDate);
      onChange && onChange(newDate);
    }
  };
 
  const handleTimeChange = (type, value) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
        );
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();
        const isPM = value === "PM";
        const is12HourPM = currentHours >= 12;
        
        if (isPM && !is12HourPM) {
          newDate.setHours(currentHours + 12);
        } else if (!isPM && is12HourPM) {
          newDate.setHours(currentHours - 12);
        }
      }
      setDate(newDate);
      onChange && onChange(newDate);
    }
  };
 
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>MM/DD/YYYY hh:mm aa</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border rounded-md shadow-md">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className="border-r border-gray-200 "
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x border-gray-200">
            <ScrollArea className="w-64 sm:w-auto bg-gray-50">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className={cn(
                      "sm:w-full shrink-0 aspect-square",
                      "hover:bg-gray-200 transition-colors ",
                      date && date.getHours() % 12 === hour % 12 && "bg-primary text-primary-foreground hover:bg-primary/90  "
                    )}
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar 
                orientation="horizontal" 
                className="sm:hidden flex h-2.5 bg-gray-100 rounded-sm" 
                thumbClassName="bg-gray-400 hover:bg-gray-500 rounded-sm"
              />
            </ScrollArea>
            <ScrollArea className="w-64 overflow-y-auto sm:w-auto bg-gray-50">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className={cn(
                      "sm:w-full shrink-0 aspect-square",
                      "hover:bg-gray-200 transition-colors",
                      date && date.getMinutes() === minute && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar 
                orientation="horizontal" 
                className="sm:hidden flex h-2.5 bg-gray-100 rounded-sm" 
                thumbClassName="bg-gray-400 hover:bg-gray-500 rounded-sm"
              />
            </ScrollArea>
            <ScrollArea className="bg-gray-50">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className={cn(
                      "sm:w-full shrink-0 aspect-square",
                      "hover:bg-gray-200 transition-colors",
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12)) && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

