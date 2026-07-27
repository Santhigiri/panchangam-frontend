import { clearEtagCache, readEtagCache, writeEtagCache } from "./etagCache"
import type * as z from "zod"

type FetchWithEtagOptions<T> = {
  onBackgroundUpdate?: (data: T) => void
}

async function fetchAndCache<T>(
  url: string,
  cacheKey: string,
  schema: z.ZodType<T>,
  etag: string | null
): Promise<T | null> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(etag ? { "If-None-Match": etag } : {}),
    },
  })

  if (response.status === 304) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }

  const json = await response.json()
  const data = await schema.parseAsync(json)

  const newEtag = response.headers.get("etag")
  if (newEtag) {
    await writeEtagCache(cacheKey, newEtag, json)
  }

  return data
}

export async function fetchWithEtag<T>(
  url: string,
  cacheKey: string,
  schema: z.ZodType<T>,
  options: FetchWithEtagOptions<T> = {}
): Promise<T> {
  const cached = await readEtagCache(cacheKey)

  if (cached) {
    try {
      const cachedData = await schema.parseAsync(cached.data)

      // Stale-while-revalidate: hand back the cached value immediately — no
      // waiting on the network at all — and quietly refresh in the
      // background. A 304 means nothing changed; a 200 updates the cache and
      // notifies the caller so it can update its own state (e.g. push the
      // fresh data into a React Query cache).
      void fetchAndCache(url, cacheKey, schema, cached.etag)
        .then((data) => {
          if (data !== null) options.onBackgroundUpdate?.(data)
        })
        .catch(() => {
          // Best-effort — a failed background revalidation just leaves the
          // cached value in place until the next natural refetch retries it.
        })

      return cachedData
    } catch {
      // Cached payload no longer matches the schema — drop it and fall
      // through to a normal blocking fetch below.
      await clearEtagCache(cacheKey)
    }
  }

  const data = await fetchAndCache(url, cacheKey, schema, null)
  if (data === null) {
    // Unreachable in practice — a 304 only ever comes back when we sent an
    // ETag, which only happens in the cached branch above.
    throw new Error(`Unexpected 304 response with no cached data for ${url}`)
  }
  return data
}
