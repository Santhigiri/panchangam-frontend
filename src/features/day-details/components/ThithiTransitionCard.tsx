import { MoonIcon } from "lucide-react"
import { CompactTransitionRow } from "./CompactTransitionRow"
import type { Thithi, ThithiTransition } from "@/features/panchangam/schemas/panchangamData"
import { getFormattedDateTime } from "@/lib/utils"

type ThithiTransitionCardProps = {
  transitions: Array<ThithiTransition>,
  current_thithi: Thithi
}

export default function ThithiTransitionCard({ transitions, current_thithi }: ThithiTransitionCardProps) {
  return (
    transitions.map((transition, idx) => (
      <CompactTransitionRow
        key={`thithi-transition-${idx}`}
        icon={MoonIcon}
        label="Thithi"
        value={transition.thithi.en}
        subLabel={transition.thithi.paksha.en}
        timeRange={`${getFormattedDateTime(transition.start_time)} - ${getFormattedDateTime(transition.end_time)}`}
        isCurrent={transition.thithi.en === current_thithi.en}
      />
    ))
  )
}
