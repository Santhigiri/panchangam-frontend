import * as z from "zod"
import { masa, nakshatra, thithi } from "./schemas/panchangamData"
import { santhigiriEvent } from "./schemas/santhigiriEvent"
import { fetchWithEtag } from "./conditionalFetch"

const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL

function fetchReference<T>(path: string, schema: z.ZodType<T>) {
  return fetchWithEtag(`${APP_BASE_URL}/api/v1/panchangam/${path}`, path, schema)
}

export function getNakshatraReference() {
  return fetchReference("nakshatra", z.array(nakshatra))
}

export function getThithiReference() {
  return fetchReference("thithi", z.array(thithi))
}

export function getSanthigiriEvents() {
  return fetchReference("events", z.array(santhigiriEvent))
}

export function getMasaReference() {
  return fetchReference("masa", z.array(masa))
}
