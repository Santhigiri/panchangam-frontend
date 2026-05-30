import { monthlyPanchangamData } from "./schemas/panchangamData"

const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL

export async function getPanchangam(
  year: number,
  month: string,
  latitude: number = 8.6318,
  longitude: number = 76.897) {


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

  const json = await response.json()

  try {
    const data = await monthlyPanchangamData.parseAsync(json)
    return data

  } catch (e) {
    console.error(e)

  }

}
