import type { LocationSearchResult } from "@/features/starfinder/schemas/locationSearchResult"
import { nominatimSearchResponse } from "@/features/starfinder/schemas/locationSearchResult"

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search"

// Nominatim's usage policy asks for an identifying User-Agent, which browsers
// don't allow client-side JS to set; the page's Referer header stands in for it.

export async function searchLocations(query: string): Promise<Array<LocationSearchResult>> {
  const params = new URLSearchParams({
    format: "json",
    q: query,
    limit: "5",
  })

  const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params}`, {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new Error(`Failed to search locations: ${response.status}`)
  }

  const results = nominatimSearchResponse.parse(await response.json())

  return results.map((result) => ({
    label: result.display_name,
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  }))
}
