import type { SunriseSunsetData } from "@/api/schemas/sunriseSunset"
import { sunriseSunsetData } from "@/api/schemas/sunriseSunset"
import { dateToKey } from "@/hooks/homepage/useCalendarPanchangam"

const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL

export async function getSunriseSunset(
  day: Date,
  latitude: number,
  longitude: number
): Promise<SunriseSunsetData> {
  const params = new URLSearchParams({
    day: dateToKey(day),
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
  return sunriseSunsetData.parse(json)
}
