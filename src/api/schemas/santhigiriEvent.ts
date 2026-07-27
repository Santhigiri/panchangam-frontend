import * as z from "zod"

export const santhigiriEvent = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
})

export type SanthigiriEvent = z.infer<typeof santhigiriEvent>

export const santhigiriEventDetail = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  sort_order: z.number().int().nullable(),
  nakshatra_id: z.number().int().nullable(),
  thithi_id: z.number().int().nullable(),
  ml_day: z.number().int().nullable(),
  ml_month: z.number().int().nullable(),
  ml_year: z.number().int().nullable(),
  en_day: z.number().int().nullable(),
  en_month: z.number().int().nullable(),
  en_year: z.number().int().nullable(),
  occurance: z.number().int().nullable(),
  is_poornima: z.boolean().nullable(),
  last_occurance: z.boolean().nullable(),
})

export type SanthigiriEventDetail = z.infer<typeof santhigiriEventDetail>

export type SanthigiriEventFormValues = Omit<SanthigiriEventDetail, "id"> & {
  id: string
}
