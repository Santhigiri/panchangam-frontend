import { Skeleton } from "@/components/ui/skeleton"

export default function DateHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 py-1">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-36" />
    </div>
  )
}
