import { useState } from "react"
import { endOfMonth, format, startOfMonth } from "date-fns"
import { useMutation } from "@tanstack/react-query"
import { panchangamColumns } from "../columns"
import { generatePanchangam } from "@/api/panchangamGeneration"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAccessToken, useAuth } from "@/hooks/useAuth"
import { usePanchangamMonth } from "@/hooks/usePanchangamMonth"
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants"

const LOCATION = "tvm"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const YEAR_OPTIONS = Array.from(
  { length: CALENDAR_END_DATE.getFullYear() - CALENDAR_START_DATE.getFullYear() + 1 },
  (_, i) => CALENDAR_START_DATE.getFullYear() + i
)

export default function PanchangamTab() {
  const { isAuthenticated, role } = useAuth()
  const isAdmin = role === "admin"

  const [activeMonth, setActiveMonth] = useState(() => startOfMonth(new Date()))

  const { data: monthData, isLoading, isError } = usePanchangamMonth(
    activeMonth,
    LOCATION
  )

  const generateMutation = useMutation({
    mutationFn: () => {
      const accessToken = getAccessToken()
      if (!accessToken) {
        throw new Error("You need to log in to do this")
      }
      return generatePanchangam(
        startOfMonth(activeMonth),
        endOfMonth(activeMonth),
        LOCATION,
        accessToken
      )
    },
  })

  // The backend's monthly endpoint can include a few days that spill outside
  // the requested Gregorian month (e.g. Malayalam-calendar boundary days) —
  // keep only rows whose date actually falls within the selected month.
  const activeMonthPrefix = format(activeMonth, "yyyy-MM")
  const rows = monthData
    ? Object.values(monthData)
        .filter((day) => day.date.startsWith(activeMonthPrefix))
        .sort((a, b) => a.date.localeCompare(b.date))
    : []

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Month</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Select
              value={String(activeMonth.getMonth())}
              onValueChange={(value) =>
                setActiveMonth((m) => startOfMonth(new Date(m.getFullYear(), Number(value), 1)))
              }
            >
              <SelectTrigger aria-label="Month">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTH_NAMES.map((name, index) => (
                  <SelectItem key={name} value={String(index)}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(activeMonth.getFullYear())}
              onValueChange={(value) =>
                setActiveMonth((m) => startOfMonth(new Date(Number(value), m.getMonth(), 1)))
              }
            >
              <SelectTrigger aria-label="Year">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              disabled={!isAdmin || generateMutation.isPending}
              onClick={() => generateMutation.mutate()}
            >
              {generateMutation.isPending
                ? "Generating..."
                : `Generate ${format(activeMonth, "MMMM yyyy")}`}
            </Button>
            {!isAuthenticated && (
              <span className="text-sm text-muted-foreground">
                Log in as an admin to generate data.
              </span>
            )}
            {isAuthenticated && !isAdmin && (
              <span className="text-sm text-muted-foreground">
                Only admins can generate data.
              </span>
            )}
          </div>

          {generateMutation.isSuccess && (
            <p className="text-sm text-foreground">
              Generated {generateMutation.data.count} day(s) from{" "}
              {generateMutation.data.start_date} to {generateMutation.data.end_date}.
            </p>
          )}
          {generateMutation.isError && (
            <p className="text-sm text-destructive">
              {generateMutation.error instanceof Error
                ? generateMutation.error.message
                : "Failed to generate panchangam data."}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{format(activeMonth, "MMMM yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}
          {isError && (
            <p className="text-sm text-destructive">
              This month hasn't been generated yet.
            </p>
          )}
          {!isLoading && !isError && rows.length > 0 && (
            <DataTable columns={panchangamColumns} data={rows} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
