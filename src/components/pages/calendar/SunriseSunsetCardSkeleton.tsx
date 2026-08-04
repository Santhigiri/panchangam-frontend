import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SunriseSunsetCardSkeleton() {
  return (
    <Card className="rounded-md py-4">
      <CardContent className="flex flex-col items-center gap-3 px-4">
        <div className="flex w-full items-end justify-between gap-2">
          <div className="flex flex-col items-start gap-0.5">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="mt-1 h-3 w-14" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="mt-1 h-3 w-14" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <Skeleton className="h-2 w-full rounded-full" />

        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  )
}
