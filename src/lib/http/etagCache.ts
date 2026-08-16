import { createStore, del, get, set } from "idb-keyval"

// Legacy prefix from the old localStorage-backed cache — kept only so we can
// clean up leftover entries now that the cache lives in IndexedDB.
const STORAGE_PREFIX = "panchangam.etag-cache."

const store = createStore("panchangam-etag-cache", "entries")

type CacheEntry = {
  etag: string
  data: unknown
}

// One-time best-effort sweep: drop any leftover legacy localStorage entries
// from before the IndexedDB migration. Their data isn't worth migrating — a
// cache miss just costs one extra fetch — this just stops them from lingering
// as stale duplicates for keys that never get re-fetched.
try {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i)
    if (k?.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k)
  }
} catch {
  // Ignore — private browsing / storage disabled.
}

export async function readEtagCache(key: string): Promise<CacheEntry | null> {
  try {
    const value = await get<CacheEntry>(key, store)
    return value ?? null
  } catch {
    return null
  }
}

export async function writeEtagCache(key: string, etag: string, data: unknown) {
  try {
    await set(key, { etag, data }, store)
  } catch {
    // Storage full or unavailable — the cache is a pure optimization, safe to skip.
  }
}

export async function clearEtagCache(key: string) {
  try {
    await del(key, store)
  } catch {
    // No-op — nothing to clean up if storage is unavailable.
  }
}
