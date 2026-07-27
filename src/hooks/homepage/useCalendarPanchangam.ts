import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PanchangamDayData } from "@/api/schemas/panchangamData";
import { getPanchangamYear } from "@/api/panchangamGeneration";
import {
  useMasaReference,
  useNakshatraReference,
  useSanthigiriEvents,
  useThithiReference,
} from "@/hooks/usePanchangamReference";
import { enrichPanchangamDay } from "@/lib/enrichPanchangamData";
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants";

const LOCATION = "tvm"

export function dateToKey(dt: Date) {
  const dateString = [
    dt.getFullYear(),
    String(dt.getMonth() + 1).padStart(2, "0"),
    String(dt.getDate()).padStart(2, "0"),
  ].join("-");

  return dateString
}

export function useCalendarPanchangam(initialActiveDate = new Date()) {
  const [activeDate, setActiveDate] = useState<Date>(initialActiveDate);
  const year = activeDate.getFullYear()

  const previousYear = year - 1
  const nextYear = year + 1
  const hasPreviousYear = previousYear >= CALENDAR_START_DATE.getFullYear()
  const hasNextYear = nextYear <= CALENDAR_END_DATE.getFullYear()

  // staleTime: 0 — always revalidate on mount/focus; the yearly endpoint is
  // ETag-validated so a revalidation that finds nothing changed is a cheap 304,
  // not a full refetch.
  const yearQuery = useQuery({
    queryKey: ["panchangam-year-v1", year, LOCATION],
    queryFn: () => getPanchangamYear(year, LOCATION),
    staleTime: 0,
  })

  // Fetched (not just prefetched) so their data is available for the outside
  // days the calendar grid shows from the neighbouring month — e.g. viewing
  // December, the January-next-year outside days need next year's data,
  // which lives under a different ETag than the active year. This also
  // doubles as the "prefetch ahead of navigation" warming: jumping to
  // Dec→Jan (or the year selector) hits an already-cached/ETag-validated
  // query instead of a cold fetch.
  const previousYearQuery = useQuery({
    queryKey: ["panchangam-year-v1", previousYear, LOCATION],
    queryFn: () => getPanchangamYear(previousYear, LOCATION),
    staleTime: 0,
    enabled: hasPreviousYear,
  })
  const nextYearQuery = useQuery({
    queryKey: ["panchangam-year-v1", nextYear, LOCATION],
    queryFn: () => getPanchangamYear(nextYear, LOCATION),
    staleTime: 0,
    enabled: hasNextYear,
  })

  const nakshatraReference = useNakshatraReference()
  const thithiReference = useThithiReference()
  const masaReference = useMasaReference()
  const eventsReference = useSanthigiriEvents()

  const isLoading =
    yearQuery.isLoading ||
    nakshatraReference.isLoading ||
    thithiReference.isLoading ||
    masaReference.isLoading ||
    eventsReference.isLoading

  const referenceMaps = useMemo(
    () => ({
      nakshatraByName: new Map((nakshatraReference.data ?? []).map((n) => [n.name, n])),
      thithiByName: new Map((thithiReference.data ?? []).map((t) => [t.name, t])),
      masaByName: new Map((masaReference.data ?? []).map((m) => [m.name, m])),
      eventById: new Map((eventsReference.data ?? []).map((e) => [e.id, e])),
    }),
    [nakshatraReference.data, thithiReference.data, masaReference.data, eventsReference.data]
  )

  const monthData = useMemo(() => {
    if (!yearQuery.data) return undefined
    const combined = {
      ...previousYearQuery.data,
      ...yearQuery.data,
      ...nextYearQuery.data,
    }
    const enriched: Record<string, PanchangamDayData> = {}
    for (const [key, compact] of Object.entries(combined)) {
      enriched[key] = enrichPanchangamDay(compact, referenceMaps)
    }
    return enriched
  }, [yearQuery.data, previousYearQuery.data, nextYearQuery.data, referenceMaps])

  // Derived keys
  const [monthStartDate, monthEndDate] = useMemo(() => [
    new Date(activeDate.getFullYear(), activeDate.getMonth(), 1),
    new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0),
  ], [activeDate]);

  const startKey = dateToKey(monthStartDate);
  const endKey = dateToKey(monthEndDate);

  // Month events
  const monthEvents = useMemo(() => {
    if (!monthData) return [];
    const yr = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const daysInMonth = new Date(yr, month + 1, 0).getDate();
    const monthDates = Array.from({ length: daysInMonth }, (_, i) => new Date(yr, month, i + 1));

    return monthDates.flatMap((dt) => {
      const key = dateToKey(dt);
      const dayData = (monthData as Record<string, PanchangamDayData | undefined>)[key];
      if (!dayData) return [];
      return dayData.santhigiri_significant_dates.map((e) => ({ dt, key, e }));
    });
  }, [monthData, activeDate]);

  return {
    activeDate,
    setActiveDate,
    monthData,
    isLoading,
    startKey,
    endKey,
    monthEvents,
    monthStartDate,
    monthEndDate,
  };
}
