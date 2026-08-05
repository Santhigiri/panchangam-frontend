import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StarfinderResultPanelSkeleton() {
  return (
    <Card className="rounded-xl bg-foreground py-5 ring-foreground/20">
      <CardContent className="flex flex-col gap-4 px-5">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-40 bg-background/20" />
          <Skeleton className="h-4 w-48 bg-background/20" />
          <Skeleton className="h-4 w-36 bg-background/20" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-lg bg-background/10" />
          <Skeleton className="h-24 rounded-lg bg-background/10" />
        </div>

        <Skeleton className="h-20 rounded-lg bg-background/10" />
      </CardContent>
    </Card>
  )
}
