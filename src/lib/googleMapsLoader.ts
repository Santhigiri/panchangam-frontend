import { importLibrary, setOptions } from "@googlemaps/js-api-loader"

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

let loadPromise: Promise<void> | null = null

export function loadGoogleMaps(): Promise<void> {
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(
      new Error("VITE_GOOGLE_MAPS_API_KEY is not configured")
    )
  }

  if (!loadPromise) {
    setOptions({ key: GOOGLE_MAPS_API_KEY })
    loadPromise = importLibrary("places").then(() => undefined)
  }

  return loadPromise
}
