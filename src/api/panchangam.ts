export async function getPanchangam(
  year: number,
  month: string,
  latitude: number = 8.631891978113215,
  longitude: number = 76.8977255008525
) {
  const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL

  const response = await fetch(
    `${APP_BASE_URL}/panchangam/monthly?year=${year}&month=${month}&latitude=${latitude}&longitude=${longitude}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch panchangam")
  }

  return response.json()
}
