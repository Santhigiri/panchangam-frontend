import { format } from "date-fns"
import * as z from "zod"
import { compactPanchangamData, panchangamGenerateResult } from "./schemas/compactPanchangamData"
import { fetchWithEtag } from "./conditionalFetch"

const compactPanchangamMonth = z.record(z.string(), compactPanchangamData)
export type CompactPanchangamMonth = z.infer<typeof compactPanchangamMonth>

const compactPanchangamYear = z.record(z.string(), compactPanchangamData)
export type CompactPanchangamYear = z.infer<typeof compactPanchangamYear>

const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL

export class UnauthorizedError extends Error {
  constructor() {
    super("You need to log in to do this")
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("You don't have permission to do this")
    this.name = "ForbiddenError"
  }
}

function dateKey(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export async function getPanchangamMonth(year: number, month: number, location: string): Promise<CompactPanchangamMonth> {
  const response = await fetch(
    `${APP_BASE_URL}/api/v1/panchangam/month?year=${year}&month=${month}&location=${location}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch panchangam for ${year}-${month}`)
  }

  const json = await response.json()
  return compactPanchangamMonth.parseAsync(json)
}

export function getPanchangamYear(year: number, location: string): Promise<CompactPanchangamYear> {
  return fetchWithEtag(
    `${APP_BASE_URL}/api/v1/panchangam/year?year=${year}&location=${location}`,
    `year:${location}:${year}`,
    compactPanchangamYear
  )
}

export async function generatePanchangam(
  startDate: Date,
  endDate: Date,
  location: string,
  accessToken: string
) {
  const response = await fetch(
    `${APP_BASE_URL}/api/v1/panchangam/generate?location=${location}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        start_date: dateKey(startDate),
        end_date: dateKey(endDate),
      }),
    }
  )

  if (response.status === 401) throw new UnauthorizedError()
  if (response.status === 403) throw new ForbiddenError()
  if (!response.ok) {
    throw new Error("Failed to generate panchangam data")
  }

  const json = await response.json()
  return panchangamGenerateResult.parseAsync(json)
}
