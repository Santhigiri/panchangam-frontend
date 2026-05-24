import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getPanchangam } from "@/api/panchangam"
import { useEffect } from "react"

export function usePanchangam(date: Date) {
  const queryClient = useQueryClient()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")

  const query = useQuery({
    queryKey: ["panchangam", year, month],
    queryFn: () => {
      return getPanchangam(year, month)
    },
    placeholderData: (previousData) => previousData,
  })

  useEffect(() => {
    if (query.isSuccess) {
      const prefetchMonth = (offset: number) => {
        const targetDate = new Date(date)
        targetDate.setMonth(targetDate.getMonth() + offset)
        const targetYear = targetDate.getFullYear()
        const targetMonth = String(targetDate.getMonth() + 1).padStart(2, "0")
        const queryKey = ["panchangam", targetYear, targetMonth]

        if (!queryClient.getQueryData(queryKey)) {
          queryClient.prefetchQuery({
            queryKey,
            queryFn: () => getPanchangam(targetYear, targetMonth),
          })
        }
      }

      prefetchMonth(-1)
      prefetchMonth(1)
    }
  }, [date, query.isSuccess, queryClient])

  return query
}
