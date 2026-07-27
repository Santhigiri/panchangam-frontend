import { clearEtagCache, readEtagCache, writeEtagCache } from "./etagCache"
import type * as z from "zod"

export async function fetchWithEtag<T>(
  url: string,
  cacheKey: string,
  schema: z.ZodType<T>,
  allowCache: boolean = true
): Promise<T> {
  const cached = allowCache ? await readEtagCache(cacheKey) : null

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(cached ? { "If-None-Match": cached.etag } : {}),
    },
  })

  if (response.status === 304 && cached) {
    try {
      return await schema.parseAsync(cached.data)
    } catch {
      // Cached payload no longer matches the schema — refetch without the
      // conditional header to force a fresh 200 with a real body.
      await clearEtagCache(cacheKey)
      return fetchWithEtag(url, cacheKey, schema, false)
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }

  const json = await response.json()
  const data = await schema.parseAsync(json)

  const etag = response.headers.get("etag")
  if (etag) {
    await writeEtagCache(cacheKey, etag, json)
  }

  return data
}
