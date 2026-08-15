import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CompactTransitionRowSkeleton() {
  return (
    <Card className="rounded-md py-3">
      <CardContent className="flex flex-row items-center gap-3 px-4">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex flex-col gap-1.5 min-w-0">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </CardContent>
    </Card>
  )
}
