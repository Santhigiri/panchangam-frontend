import { useQuery } from "@tanstack/react-query"
import { getPanchangamMonth } from "@/features/panchangam/api/panchangamGeneration"

export function usePanchangamMonth(activeMonth: Date, location: string) {
  const year = activeMonth.getFullYear()
  const month = activeMonth.getMonth() + 1

  return useQuery({
    queryKey: ["panchangam-month-v1", year, month, location],
    queryFn: () => getPanchangamMonth(year, month, location),
    staleTime: 10000
  })
}
