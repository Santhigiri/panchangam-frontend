import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { searchLocations } from "@/features/starfinder/api/locationSearch"

const MIN_QUERY_LENGTH = 3
const DEBOUNCE_MS = 400

export function useLocationSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setDebouncedQuery("")
      return
    }

    const timeout = setTimeout(() => setDebouncedQuery(trimmed), DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [query])

  return useQuery({
    queryKey: ["starfinder", "location-search", debouncedQuery],
    queryFn: () => searchLocations(debouncedQuery),
    enabled: debouncedQuery.length >= MIN_QUERY_LENGTH,
    staleTime: 60_000,
  })
}
