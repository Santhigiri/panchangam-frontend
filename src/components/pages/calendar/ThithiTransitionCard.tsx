import type { Thithi, ThithiTransition } from "@/api/schemas/panchangamData"
import { cn, getFormattedDateTime } from "@/lib/utils"
import { Clock, MoonIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type ThithiTransitionCardProps = {
  transitions: ThithiTransition[],
  current_thithi: Thithi
}

export default function ThithiTransitionCard({ transitions, current_thithi }: ThithiTransitionCardProps) {
  return (
    transitions.map((transition, idx) => (
      <Card
        key={`thithi-transition-${idx}`}
        className={cn(
          "border-l-4 border-l-amber-900 rounded-md m-2",
          transition.thithi.en === current_thithi.en ? "bg-green-100" : ""
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col">
              <p className="font-semibold text-xs text-[#554336]">THITHI</p>
              <p className="font-medium text-base md:text-lg font-playfair-display">{transition.thithi.en} ({transition.thithi.paksha.en})</p>
            </div>
            <MoonIcon className="text-amber-200 h-10 w-10" />
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-3">
          <div className="flex flex-row items-center gap-2">
            <Clock className="w-4 h-4" />
            <p className="text-sm font-inter">{getFormattedDateTime(transition.start_time)} - {getFormattedDateTime(transition.end_time)}</p>
          </div>
        </CardContent>
      </Card>
    ))
  )
}
