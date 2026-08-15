import { useQuery } from "@tanstack/react-query"
import { getSanthigiriEvent } from "@/features/santhigiri-events/api/santhigiriEvents"

export function useSanthigiriEventDetail(eventId: string | null) {
  return useQuery({
    queryKey: ["santhigiri-event", eventId],
    queryFn: () => getSanthigiriEvent(eventId as string),
    enabled: eventId !== null,
  })
}
