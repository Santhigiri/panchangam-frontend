export async function getPanchangam(
  year: number,
  month: string
) {
  const response = await fetch(
    `http://127.0.0.1:8000/panchangam/monthly?year=${year}&month=${month}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch panchangam")
  }

  return response.json()
}
