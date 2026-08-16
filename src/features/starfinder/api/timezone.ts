import * as z from "zod"

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const timezoneResponse = z.object({
  status: z.string(),
  timeZoneId: z.string().optional(),
  errorMessage: z.string().optional(),
})

export async function getTimezoneForLocation(
  latitude: number,
  longitude: number
): Promise<string> {
  const params = new URLSearchParams({
    location: `${latitude},${longitude}`,
    timestamp: String(Math.floor(Date.now() / 1000)),
    key: GOOGLE_MAPS_API_KEY ?? "",
  })

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?${params}`
  )

  if (!response.ok) {
    throw new Error(`Failed to resolve timezone: ${response.status}`)
  }

  const parsed = timezoneResponse.parse(await response.json())

  if (parsed.status !== "OK" || !parsed.timeZoneId) {
    throw new Error(parsed.errorMessage ?? `Timezone lookup failed: ${parsed.status}`)
  }

  return parsed.timeZoneId
}
