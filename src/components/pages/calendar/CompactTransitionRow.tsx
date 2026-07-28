import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type CompactTransitionRowProps = {
  icon: LucideIcon
  label: string
  value: string
  subLabel?: string
  timeRange: string
  isCurrent: boolean
}

export function CompactTransitionRow({
  icon: Icon,
  label,
  value,
  subLabel,
  timeRange,
  isCurrent,
}: CompactTransitionRowProps) {
  return (
    <Card className={cn("rounded-md py-2", isCurrent && "bg-amber-100 border-amber-300")}>
      <CardContent className="flex flex-row items-center gap-3 px-3">
        <Icon className="h-5 w-5 text-amber-700 shrink-0" />
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium font-playfair-display truncate">
            {value}
            {subLabel && <span className="text-xs text-muted-foreground"> ({subLabel})</span>}
          </p>
          <p className="text-[11px] text-muted-foreground font-inter">{timeRange}</p>
        </div>
        <span className="sr-only">{label}</span>
      </CardContent>
    </Card>
  )
}
