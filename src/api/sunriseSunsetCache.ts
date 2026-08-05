import { createStore, get, set } from "idb-keyval"

const store = createStore("panchangam-sunrise-sunset-cache", "entries")

// Rounded to 1 decimal place (~11km) — IP geolocation can resolve to
// slightly different coordinates across sessions for the same visitor, and
// sunrise/sunset barely shifts over city-scale distances, so coarse rounding
// buys a much higher cache-hit rate without meaningfully affecting accuracy.
function cacheKey(day: string, latitude: number, longitude: number): string {
  return `${day}|${latitude.toFixed(1)}|${longitude.toFixed(1)}`
}

export async function readSunriseSunsetCache(
  day: string,
  latitude: number,
  longitude: number
): Promise<unknown | null> {
  try {
    const value = await get(cacheKey(day, latitude, longitude), store)
    return value ?? null
  } catch {
    return null
  }
}

export async function writeSunriseSunsetCache(
  day: string,
  latitude: number,
  longitude: number,
  data: unknown
) {
  try {
    await set(cacheKey(day, latitude, longitude), data, store)
  } catch {
    // Storage full or unavailable — the cache is a pure optimization, safe to skip.
  }
}
