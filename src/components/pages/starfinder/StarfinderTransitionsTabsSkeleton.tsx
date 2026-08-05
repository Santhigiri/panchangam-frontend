import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StarfinderTransitionsTabsSkeleton() {
  return (
    <Card className="rounded-xl py-4">
      <CardContent className="flex flex-col gap-3 px-4">
        <Skeleton className="h-9 w-full rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
