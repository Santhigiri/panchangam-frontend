import * as z from "zod"

const nominatimResult = z.object({
  display_name: z.string(),
  lat: z.string(),
  lon: z.string(),
})

export const nominatimSearchResponse = z.array(nominatimResult)

export type LocationSearchResult = {
  label: string
  latitude: number
  longitude: number
}
