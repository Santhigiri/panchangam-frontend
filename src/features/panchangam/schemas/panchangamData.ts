import * as z from "zod";

const isoDatetime = z.string().refine((val) => {
  return !Number.isNaN(Date.parse(val))
})

export type ISODatetime = z.infer<typeof isoDatetime>


export const nakshatra = z.object({
  name: z.string(),
  id: z.number().int(),
  ml: z.string(),
  en: z.string()
})

export type Nakshatra = z.infer<typeof nakshatra>

export const masa = z.object({
  name: z.string(),
  id: z.number().int(),
  ml: z.string(),
  en: z.string()
})

export type Masa = z.infer<typeof masa>

export const paksha = z.object({
  name: z.string(),
  id: z.number().int(),
  ml: z.string(),
  en: z.string()
})

export const thithi = z.object({
  name: z.string(),
  paksha: paksha,
  id: z.number().int(),
  en: z.string(),
  ml: z.string()
})

export type Thithi = z.infer<typeof thithi>


export const thithi_transition = z.object({
  name: z.string(),
  thithi: thithi,
  start_time: isoDatetime,
  end_time: isoDatetime.nullable()
})

export type ThithiTransition = z.infer<typeof thithi_transition>

export const nakshatra_transition = z.object({
  name: z.string(),
  nakshatra: nakshatra,
  start_time: isoDatetime,
  end_time: isoDatetime.nullable()
})

export type NakshatraTransition = z.infer<typeof nakshatra_transition>

export const kollavarsham = z.object({
  kv_day: z.int(),
  kv_month: z.int(),
  kv_year: z.int(),
  kv_month_name_en: z.string(),
  kv_month_name_ml: z.string()
})

export type KollavarshamDate = z.infer<typeof kollavarsham>

export const santhigiri_significance = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string()
})

export type SanthigiriSignificance = z.infer<typeof santhigiri_significance>

export const panchangamData = z.object({
  date: z.iso.date(),
  kv: kollavarsham,
  nakshatra: nakshatra,
  thithi: thithi,
  thithi_transitions: z.array(thithi_transition),
  nakshatra_transitions: z.array(nakshatra_transition),
  sunrise: isoDatetime,
  sunset: isoDatetime,
  nazhika_from_sunrise: z.number(),
  santhigiri_significant_dates: z.array(santhigiri_significance)
})

export type PanchangamDayData = z.infer<typeof panchangamData>
