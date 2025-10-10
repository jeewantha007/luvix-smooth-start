import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const DateTimePicker = React.forwardRef<
  HTMLDivElement,
  DateTimePickerProps
>(({ value, onChange, placeholder = "Select date and time", className }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");

  // Parse initial value
  useEffect(() => {
    if (value) {
      const dateObj = new Date(value);
      if (!isNaN(dateObj.getTime())) {
        setDate(dateObj);
        // Extract time in HH:MM format
        const hours = dateObj.getHours().toString().padStart(2, "0");
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");
        setTime(`${hours}:${minutes}`);
      }
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      onChange?.(newDate.toISOString());
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (date && newTime) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      onChange?.(newDate.toISOString());
    }
  };

  const displayValue = value ? format(new Date(value), "PPP p") : "";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!value && "text-muted-foreground"} ${className}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Select Date and Time</h4>
            <p className="text-sm text-muted-foreground">
              Choose the date and time for your training session
            </p>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <TimePicker
              value={time}
              onChange={handleTimeChange}
              placeholder="Select time"
              className="flex-1"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

DateTimePicker.displayName = "DateTimePicker";