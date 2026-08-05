import type { CompactPanchangamData } from "@/api/schemas/compactPanchangamData"
import { compactPanchangamData } from "@/api/schemas/compactPanchangamData"
import { dateToKey } from "@/hooks/homepage/useCalendarPanchangam"

const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL

export async function getPanchangamAtInstant(
  day: Date,
  timeOfDay: string,
  latitude: number,
  longitude: number,
  timezone: string
): Promise<CompactPanchangamData> {
  const params = new URLSearchParams({
    day: dateToKey(day),
    time: timeOfDay,
    latitude: String(latitude),
    longitude: String(longitude),
    timezone,
  })

  const response = await fetch(`${APP_BASE_URL}/api/v1/panchangam/instant?${params}`, {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail ?? `Failed to fetch Starfinder panchangam: ${response.status}`)
  }

  return compactPanchangamData.parse(await response.json())
}
