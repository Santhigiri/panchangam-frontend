import { useQuery } from "@tanstack/react-query"
import { getPanchangam } from "@/api/panchangam"

export function usePanchangam(date: Date) {
  const year = date.getFullYear()

  const month = String(date.getMonth() + 1).padStart(2, "0")

  return useQuery({
    queryKey: ["panchangam", year, month],
    queryFn: () => {
      console.log("FETCHING")
      return getPanchangam(year, month)
    },
    placeholderData: (previousData) => previousData,
  })
}
