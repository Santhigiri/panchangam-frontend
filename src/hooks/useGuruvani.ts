import { useQuery } from "@tanstack/react-query"
import { getGuruvanis, getRandomGuruvani } from "@/api/guruvani"

export function useGuruvanis() {
  return useQuery({
    queryKey: ["guruvani"],
    queryFn: getGuruvanis,
  })
}

const RANDOM_GURUVANI_STALE_TIME = 1000 * 60 * 5 // 5 minutes, revisit once traffic patterns are known

export function useRandomGuruvani() {
  return useQuery({
    queryKey: ["guruvani-random"],
    queryFn: getRandomGuruvani,
    staleTime: RANDOM_GURUVANI_STALE_TIME,
    retry: false,
  })
}
