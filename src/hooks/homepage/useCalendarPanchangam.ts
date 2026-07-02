import { useMemo, useState } from "react";
import { usePanchangam } from "@/hooks/usePanchangam";

export function dateToKey(dt: Date) {
  console.log(`parsing date: ${dt}`)
  const dateString = [
    dt.getFullYear(),
    String(dt.getMonth() + 1).padStart(2, "0"),
    String(dt.getDate()).padStart(2, "0"),
  ].join("-");


  console.log(`parsed string: ${dateString}`)
  return dateString
}

export function useCalendarPanchangam(initialActiveDate = new Date(), initialSelectedDate = new Date()) {
  const [activeDate, setActiveDate] = useState<Date>(initialActiveDate);
  const [selectedDate, setSelectedDate] = useState<Date>(initialSelectedDate);

  const { data: monthData, isLoading } = usePanchangam(activeDate);

  // Derived keys
  const selectedKey = dateToKey(selectedDate);
  const [monthStartDate, monthEndDate] = useMemo(() => [
    new Date(activeDate.getFullYear(), activeDate.getMonth(), 1),
    new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0),
  ], [activeDate]);

  const startKey = dateToKey(monthStartDate);
  const endKey = dateToKey(monthEndDate);

  // Selected date data
  const selectedDateData = useMemo(() => {
    if (!monthData) return null;
    return monthData[selectedKey as keyof typeof monthData];
  }, [monthData, selectedKey]);

  // Month events
  const monthEvents = useMemo(() => {
    if (!monthData) return [];
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthDates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

    return monthDates.flatMap((dt) => {
      const key = dateToKey(dt);
      const dayData = monthData[key as keyof typeof monthData];
      if (!dayData) return [];
      return dayData.santhigiri_significant_dates.map((e) => ({ dt, key, e }));
    });
  }, [monthData, activeDate]);

  return {
    activeDate,
    setActiveDate,
    selectedDate,
    setSelectedDate,
    monthData,
    isLoading,
    selectedKey,
    startKey,
    endKey,
    selectedDateData,
    monthEvents,
    monthStartDate,
    monthEndDate,
  };
}
