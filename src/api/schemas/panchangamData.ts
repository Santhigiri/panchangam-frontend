import * as z from "zod";

const isoDatetime = z.string().refine((val) => {
  return !Number.isNaN(Date.parse(val))
})

export const nakshatra = z.object({
  name: z.string(),
  id: z.number().int(),
  ml: z.string(),
  en: z.string()
})

export const paksha = z.object({
  name: z.string(),
  id: z.number().int(),
  ml: z.string(),
  en: z.string()
})

const thithi = z.object({
  name: z.string(),
  paksha: paksha,
  id: z.number().int(),
  ml: z.string()
})


export const thithi_transition = z.object({
  name: z.string(),
  thithi: thithi,
  start_time: isoDatetime,
  end_time: isoDatetime.optional()
})

export const nakshatra_transition = z.object({
  name: z.string(),
  nakshatra: nakshatra,
  start_time: isoDatetime,
  end_time: isoDatetime.optional()
})

export const kollavarsham = z.object({
  kv_day: z.int(),
  kv_month: z.int(),
  kv_year: z.int(),
  kv_month_name_en: z.string(),
  kv_month_name_ml: z.string()
})

export const santhigiri_significant_date = z.object({
  name: z.string(),
  description: z.string()
})

export const panchangamData = z.object({
  date: z.iso.date(),
  kv: kollavarsham,
  nakshatra: nakshatra,
  thithi: thithi,
  is_pournami: z.boolean(),
  thithi_transitions: z.array(thithi_transition),
  nakshatra_transitions: z.array(nakshatra_transition),
  sunrise: isoDatetime,
  sunset: isoDatetime,
  nazhika_from_sunrise: z.number(),
  santhigiri_significant_dates: z.array(santhigiri_significant_date)
})

export const monthlyPanchangamData = z.record(z.string(), panchangamData)
