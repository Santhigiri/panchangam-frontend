import { useMemo, useState } from "react";
import { usePanchangam } from "./usePanchangam";
import { dateToKey } from "./homepage/useCalendarPanchangam";

export default function useDayDetails() {
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const { data: monthData } = usePanchangam(activeDate);

  const activeDateData = useMemo(() => {
    if (!monthData) return null;
    const key = dateToKey(activeDate);
    return monthData[key as keyof typeof monthData] ?? null;
  }, [monthData, activeDate]);

  return {
    activeDate,
    setActiveDate,
    activeDateData,
  };
}
