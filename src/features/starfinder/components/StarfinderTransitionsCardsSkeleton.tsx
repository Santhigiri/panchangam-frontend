import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function TransitionCardSkeleton() {
  return (
    <Card className="rounded-xl py-4">
      <CardContent className="flex flex-col gap-3 px-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function StarfinderTransitionsCardsSkeleton() {
  return (
    <>
      <TransitionCardSkeleton />
      <TransitionCardSkeleton />
    </>
  )
}
