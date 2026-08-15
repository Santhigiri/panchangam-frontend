import { useQuery } from "@tanstack/react-query"
import { getIpLocation } from "@/features/day-details/api/ipLocation"
import { getSunriseSunset } from "@/features/day-details/api/sunriseSunset"
import { dateToKey } from "@/lib/date"

// Resolved once per session (staleTime/gcTime: Infinity) rather than
// re-fetched on every date navigation — the visitor's location doesn't
// change while browsing different days.
export function useLocalSunriseSunset(date: Date) {
  const locationQuery = useQuery({
    queryKey: ["ip-location"],
    queryFn: getIpLocation,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  })

  const location = locationQuery.data

  const sunriseSunsetQuery = useQuery({
    queryKey: ["sunrise-sunset", dateToKey(date), location?.latitude, location?.longitude],
    queryFn: () => getSunriseSunset(date, location!.latitude, location!.longitude),
    enabled: !!location,
  })

  return {
    sunrise: sunriseSunsetQuery.data?.sunrise,
    sunset: sunriseSunsetQuery.data?.sunset,
    timeZone: location?.timezone,
    isLoading: locationQuery.isLoading || sunriseSunsetQuery.isLoading,
  }
}
