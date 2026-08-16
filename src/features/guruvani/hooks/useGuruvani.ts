import { useQuery } from "@tanstack/react-query"
import { getGuruvaniOfTheDay, getGuruvanis } from "@/features/guruvani/api/guruvani"
import { dateToKey } from "@/lib/date"

export function useGuruvanis() {
  return useQuery({
    queryKey: ["guruvani"],
    queryFn: getGuruvanis,
  })
}

export function useRandomGuruvani() {
  const dayKey = dateToKey(new Date())

  // The day-key in the query key is what "invalidates" this on a day
  // rollover — a new day naturally produces a new query rather than
  // refetching under the same key. staleTime: Infinity means TanStack Query
  // never refetches within the day; getGuruvaniOfTheDay's IndexedDB cache is
  // what makes the day's pick survive reloads/app restarts.
  return useQuery({
    queryKey: ["guruvani-random", dayKey],
    queryFn: () => getGuruvaniOfTheDay(dayKey),
    staleTime: Infinity,
    retry: false,
  })
}
