import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StarfinderResultPanelSkeleton() {
  return (
    <Card className="rounded-xl py-5">
      <CardContent className="flex flex-col gap-4 px-5">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-40 bg-muted" />
          <Skeleton className="h-4 w-48 bg-muted" />
          <Skeleton className="h-4 w-36 bg-muted" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-lg bg-muted" />
          <Skeleton className="h-24 rounded-lg bg-muted" />
        </div>

        <Skeleton className="h-20 rounded-lg bg-muted" />
      </CardContent>
    </Card>
  )
}
