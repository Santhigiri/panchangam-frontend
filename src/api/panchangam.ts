
const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL

export async function getPanchangam(
  year: number,
  month: string,
  latitude: number = 8.6318,
  longitude: number = 76.897) {

  console.log(`APP_BASE_URL: ${APP_BASE_URL}`)

  const response = await fetch(
    `${APP_BASE_URL}/panchangam/monthly?year=${year}&month=${month}&latitude=${latitude}&longitude=${longitude}`
    , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch panchangam")
  }

  return response.json()
}
