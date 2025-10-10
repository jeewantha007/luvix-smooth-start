import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const TimePicker = React.forwardRef<
  HTMLInputElement,
  TimePickerProps
>(({ value, onChange, placeholder = "Select time", className }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(":");
      if (hours && minutes) {
        const hourNum = parseInt(hours, 10);
        const minuteNum = parseInt(minutes, 10);
        
        if (!isNaN(hourNum) && !isNaN(minuteNum)) {
          if (hourNum === 0) {
            setHour("12");
            setPeriod("AM");
          } else if (hourNum < 12) {
            setHour(hourNum.toString());
            setPeriod("AM");
          } else if (hourNum === 12) {
            setHour("12");
            setPeriod("PM");
          } else {
            setHour((hourNum - 12).toString());
            setPeriod("PM");
          }
          setMinute(minuteNum.toString().padStart(2, "0"));
        }
      }
    }
  }, [value]);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 12)) {
      setHour(val);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
      setMinute(val);
    }
  };

  const handlePeriodChange = () => {
    setPeriod(period === "AM" ? "PM" : "AM");
  };

  const handleSave = () => {
    if (hour && minute) {
      let hourNum = parseInt(hour, 10);
      if (period === "AM" && hourNum === 12) {
        hourNum = 0;
      } else if (period === "PM" && hourNum !== 12) {
        hourNum += 12;
      }
      
      const formattedTime = `${hourNum.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`;
      onChange?.(formattedTime);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setHour("");
    setMinute("");
    onChange?.("");
    setIsOpen(false);
  };

  const displayValue = value ? (() => {
    const [hours, minutes] = value.split(":");
    if (hours && minutes) {
      const hourNum = parseInt(hours, 10);
      const minuteNum = parseInt(minutes, 10);
      
      if (isNaN(hourNum) || isNaN(minuteNum)) return "";
      
      if (hourNum === 0) {
        return `12:${minuteNum.toString().padStart(2, "0")} AM`;
      } else if (hourNum < 12) {
        return `${hourNum}:${minuteNum.toString().padStart(2, "0")} AM`;
      } else if (hourNum === 12) {
        return `12:${minuteNum.toString().padStart(2, "0")} PM`;
      } else {
        return `${hourNum - 12}:${minuteNum.toString().padStart(2, "0")} PM`;
      }
    }
    return "";
  })() : "";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!value && "text-muted-foreground"} ${className}`}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Select Time</h4>
            <p className="text-sm text-muted-foreground">
              Choose the time for your business hours
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex flex-col items-center">
              <Input
                type="text"
                inputMode="numeric"
                value={hour}
                onChange={handleHourChange}
                placeholder="HH"
                className="w-16 text-center text-2xl"
                maxLength={2}
              />
              <span className="text-xs text-muted-foreground mt-1">Hour</span>
            </div>
            <span className="text-2xl">:</span>
            <div className="flex flex-col items-center">
              <Input
                type="text"
                inputMode="numeric"
                value={minute}
                onChange={handleMinuteChange}
                placeholder="MM"
                className="w-16 text-center text-2xl"
                maxLength={2}
              />
              <span className="text-xs text-muted-foreground mt-1">Minute</span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handlePeriodChange}
                className="w-16 text-center text-2xl"
              >
                {period}
              </Button>
              <span className="text-xs text-muted-foreground mt-1">Period</span>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1"
              disabled={!hour || !minute}
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

TimePicker.displayName = "TimePicker";