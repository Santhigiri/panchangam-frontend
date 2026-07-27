import { Star } from "lucide-react"
import { CompactTransitionRow } from "./CompactTransitionRow"
import type { Nakshatra, NakshatraTransition } from "@/api/schemas/panchangamData"
import { getFormattedDateTime } from "@/lib/utils"

export type NakshatraTransitionCardProps = {
  transitions: Array<NakshatraTransition>,
  current_nakshatra: Nakshatra
}

export function NakshatraTransitionCard({ transitions, current_nakshatra }: NakshatraTransitionCardProps) {
  return (
    transitions.map((transition, idx) => (
      <CompactTransitionRow
        key={`nakshatra-transition-${idx}`}
        icon={Star}
        label="Nakshatra"
        value={transition.nakshatra.en}
        timeRange={`${getFormattedDateTime(transition.start_time)} - ${getFormattedDateTime(transition.end_time)}`}
        isCurrent={transition.nakshatra.en === current_nakshatra.en}
      />
    ))
  )
}
