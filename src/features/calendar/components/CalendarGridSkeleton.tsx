import { Skeleton } from "@/components/ui/skeleton"

const WEEKDAY_PLACEHOLDERS = Array.from({ length: 7 })
const WEEK_ROWS = Array.from({ length: 6 })
const DAY_CELLS = Array.from({ length: 7 })

export default function CalendarGridSkeleton() {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border-2 border-border">
      <div className="flex h-auto w-full items-center justify-between border-b border-border px-2 py-2">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      <div className="grid grid-cols-7 bg-muted border-b border-border">
        {WEEKDAY_PLACEHOLDERS.map((_, idx) => (
          <div key={idx} className="flex items-center justify-center py-2">
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
      {WEEK_ROWS.map((_week, weekIdx) => (
        <div key={weekIdx} className="grid grid-cols-7 border-b border-border last:border-b-0">
          {DAY_CELLS.map((_day, dayIdx) => (
            <div
              key={dayIdx}
              className="flex min-h-14 flex-col items-center justify-center gap-1 border-r border-border p-1 last:border-r-0 md:min-h-24"
            >
              <Skeleton className="h-3 w-3/4 md:h-4" />
              <Skeleton className="hidden h-3 w-1/2 md:block" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
