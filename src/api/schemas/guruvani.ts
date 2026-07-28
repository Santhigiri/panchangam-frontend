import * as z from "zod"

export const guruvani = z.object({
  id: z.number().int(),
  text_en: z.string(),
  text_ml: z.string(),
  sort_order: z.number().int().nullable(),
})

export type Guruvani = z.infer<typeof guruvani>

export type GuruvaniFormValues = {
  text_en: string
  text_ml: string
  sort_order: number | null
}
