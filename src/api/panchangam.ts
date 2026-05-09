export async function getPanchangam(
  year: number,
  month: string,
  latitude: number = 8.631891978113215,
  longitude: number = 76.8977255008525
) {

  const response = await fetch(
    `http://127.0.0.1:8000/panchangam/monthly?year=${year}&month=${month}&latitude=${latitude}&longitude=${longitude}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch panchangam")
  }

  return response.json()
}
