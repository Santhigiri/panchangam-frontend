import { useQuery } from "@tanstack/react-query"
import {
  getMasaReference,
  getNakshatraReference,
  getSanthigiriEvents,
  getThithiReference,
} from "@/api/panchangamReference"
import { getSanthigiriEvent } from "@/api/santhigiriEvents"

const REFERENCE_STALE_TIME = 1000 * 60 * 60 * 24 // reference data changes rarely

export function useNakshatraReference() {
  return useQuery({
    queryKey: ["nakshatra-reference"],
    queryFn: getNakshatraReference,
    staleTime: REFERENCE_STALE_TIME,
  })
}

export function useThithiReference() {
  return useQuery({
    queryKey: ["thithi-reference"],
    queryFn: getThithiReference,
    staleTime: REFERENCE_STALE_TIME,
  })
}

export function useMasaReference() {
  return useQuery({
    queryKey: ["masa-reference"],
    queryFn: getMasaReference,
    staleTime: REFERENCE_STALE_TIME,
  })
}

export function useSanthigiriEvents() {
  return useQuery({
    queryKey: ["santhigiri-events"],
    queryFn: getSanthigiriEvents,
    staleTime: REFERENCE_STALE_TIME,
  })
}

export function useSanthigiriEventDetail(eventId: string | null) {
  return useQuery({
    queryKey: ["santhigiri-event", eventId],
    queryFn: () => getSanthigiriEvent(eventId as string),
    enabled: eventId !== null,
  })
}
