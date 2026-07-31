import * as z from "zod"

const isoDatetime = z.string().refine((val) => {
  return !Number.isNaN(Date.parse(val))
})

export const sunriseSunsetData = z.object({
  latitude: z.number(),
  longitude: z.number(),
  day: z.iso.date(),
  sunrise: isoDatetime,
  sunset: isoDatetime,
})

export type SunriseSunsetData = z.infer<typeof sunriseSunsetData>
