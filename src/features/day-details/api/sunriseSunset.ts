import type { SunriseSunsetData } from "@/features/day-details/schemas/sunriseSunset"
import { sunriseSunsetData } from "@/features/day-details/schemas/sunriseSunset"
import { readSunriseSunsetCache, writeSunriseSunsetCache } from "@/features/day-details/api/sunriseSunsetCache"
import { dateToKey } from "@/lib/date"

const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL

export async function getSunriseSunset(
  day: Date,
  latitude: number,
  longitude: number
): Promise<SunriseSunsetData> {
  const dayKey = dateToKey(day)

  // Sunrise/sunset is deterministic for a given (day, location) — once
  // fetched it never changes, so a cache hit skips the network entirely
  // rather than revalidating in the background.
  const cached = await readSunriseSunsetCache(dayKey, latitude, longitude)
  if (cached) {
    try {
      return sunriseSunsetData.parse(cached)
    } catch {
      // Cached payload no longer matches the schema — fall through to a fresh fetch.
    }
  }

  const params = new URLSearchParams({
    day: dayKey,
    latitude: String(latitude),
    longitude: String(longitude),
  })

  const response = await fetch(`${APP_BASE_URL}/api/v1/panchangam/sunrise-sunset?${params}`, {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch sunrise/sunset: ${response.status}`)
  }

  const json = await response.json()
  const data = sunriseSunsetData.parse(json)
  await writeSunriseSunsetCache(dayKey, latitude, longitude, json)
  return data
}
