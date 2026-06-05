"use client";

import { useState, useRef, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  setMonth,
  setYear,
} from "date-fns";
import { Flex } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDatePickerProps {
  name: string;
  placeholder?: string;
  className?: string;
}

type ViewMode = "day" | "month" | "year";

const DatePicker = ({ name, placeholder, className }: CustomDatePickerProps) => {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<ViewMode>("day");
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('left');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        setView("day");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    if (open && wrapperRef.current && dropdownRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const dropdownWidth = 280;
      const viewportWidth = window.innerWidth;
      
      const spaceOnRight = viewportWidth - wrapperRect.right;
      const spaceOnLeft = wrapperRect.left;

      const newPosition = (spaceOnRight < dropdownWidth && spaceOnLeft >= dropdownWidth) ? 'right' : 'left';

      if (newPosition !== dropdownPosition) {
        rafId = requestAnimationFrame(() => {
          setDropdownPosition(newPosition);
        });
      }
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [open, dropdownPosition]);

  const renderDays = () => {
    const startMonth = startOfMonth(currentMonth);
    const endMonth = endOfMonth(currentMonth);
    const startDate = startOfWeek(startMonth);
    const endDate = endOfWeek(endMonth);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const renderMonths = () => {
    const months = Array.from({ length: 12 }, (_, i) =>
      format(setMonth(new Date(), i), "MMMM")
    );
    return months;
  };

  const renderYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1970;

    return Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i
    );
  };

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { value, onChange } }) => {
        const selectedDate = value ? new Date(value) : undefined;

        return (
          <Flex
            position="relative"
            align="center"
            ref={wrapperRef}
            className={`bg-white border border-gray-300 rounded-md text-center min-w-26 h-8 cursor-pointer ${className || ""}`}
            onClick={() => setOpen(!open)}
          >
            <div
              className={`text-[14px] text-center mx-2 ${selectedDate ? "text-black" : "text-gray-500"
                }`}
            >
              {selectedDate ? format(selectedDate, "dd-MM-yyyy") : placeholder || "Select Date"}
            </div>

            {open && (
              <div
                ref={dropdownRef}
                className={`
                  absolute
                  top-10
                  z-50
                  p-3
                  bg-white
                  rounded-md
                  shadow-lg
                  min-w-70
                  border
                  border-gray-300
                  ${dropdownPosition === 'left' ? 'left-0' : 'right-0'}
                `}
              >
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMonth(subMonths(currentMonth, 1));
                    }}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-2">
                    <span
                      className="font-medium cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setView("month");
                      }}
                    >
                      {format(currentMonth, "MMMM")}
                    </span>
                    <span
                      className="font-medium cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setView("year");
                      }}
                    >
                      {format(currentMonth, "yyyy")}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMonth(addMonths(currentMonth, 1));
                    }}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* YEAR VIEW */}
                {view === "year" && (
                  <div className="grid grid-cols-4 gap-2 w-fit max-h-40 overflow-y-auto">
                    {renderYears().map((y) => (
                      <button
                        key={y}
                        className="p-2 rounded hover:bg-gray-100 w-fit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentMonth(setYear(currentMonth, y));
                          setView("day");
                        }}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}

                {view === "month" && (
                  <div className="grid grid-cols-3">
                    {renderMonths().map((m, idx) => (
                      <button
                        key={m}
                        className="p-1 text-sm rounded hover:bg-gray-100 w-fit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentMonth(setMonth(currentMonth, idx));
                          setView("day");
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}

                {view === "day" && (
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                      <div key={d} className="text-xs">
                        {d}
                      </div>
                    ))}

                    {renderDays().map((day) => {
                      const isDisabled = !isSameMonth(day, currentMonth);
                      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                      const isToday = isSameDay(day, today);

                      return (
                        <button
                          key={day.toString()}
                          className={`h-8 w-8 rounded-md ${isDisabled ? "text-gray-400" : "text-black"
                            } ${isSelected
                              ? "bg-blue-500 text-white"
                              : "bg-white"
                            } ${isToday ? "border border-gray-300" : ""
                            }`}
                          disabled={isDisabled}
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(format(day, "yyyy-MM-dd"));
                            setOpen(false);
                            setView("day");
                          }}
                        >
                          {format(day, "d")}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </Flex>
        );
      }}
    />
  );
};

export { DatePicker };
