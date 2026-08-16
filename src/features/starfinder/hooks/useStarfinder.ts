import { useQuery } from "@tanstack/react-query"
import { getPanchangamAtInstant } from "@/features/starfinder/api/starfinder"
import { dateToKey } from "@/lib/date"

export type StarfinderParams = {
  day: Date
  timeOfDay: string
  latitude: number
  longitude: number
  timezone: string
}

export function useStarfinder(submitted: StarfinderParams | null) {
  return useQuery({
    queryKey: [
      "starfinder",
      submitted ? dateToKey(submitted.day) : null,
      submitted?.timeOfDay,
      submitted?.latitude,
      submitted?.longitude,
      submitted?.timezone,
    ],
    queryFn: () =>
      getPanchangamAtInstant(
        submitted!.day,
        submitted!.timeOfDay,
        submitted!.latitude,
        submitted!.longitude,
        submitted!.timezone
      ),
    enabled: !!submitted,
    // A failure here is always a 400 from bad user input (out-of-range
    // coordinates, unknown timezone), never a transient one — retrying
    // just delays showing the error message the user needs to act on.
    retry: false,
  })
}
