import { createStore, get, set } from "idb-keyval"

const store = createStore("panchangam-guruvani-cache", "entries")

// Single fixed key — we only ever need "today's" pick, not a history of past
// days, so each new day simply overwrites the previous entry instead of the
// store accumulating an ever-growing list of stale day-keyed entries.
const CACHE_KEY = "current"

type CacheEntry = { dayKey: string; data: unknown }

export async function readGuruvaniOfTheDay(dayKey: string): Promise<unknown | null> {
  try {
    const entry = await get<CacheEntry>(CACHE_KEY, store)
    if (!entry || entry.dayKey !== dayKey) return null
    return entry.data
  } catch {
    return null
  }
}

export async function writeGuruvaniOfTheDay(dayKey: string, data: unknown) {
  try {
    await set(CACHE_KEY, { dayKey, data }, store)
  } catch {
    // Storage full or unavailable — the cache is a pure optimization, safe to skip.
  }
}
