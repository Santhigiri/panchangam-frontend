import type { Thithi, ThithiTransition } from "@/api/schemas/panchangamData"
import { getFormattedDateTime } from "@/lib/utils"
import { Clock, MoonIcon } from "lucide-react"

type ThithiTransitionCardProps = {
  transitions: ThithiTransition[],
  current_thithi: Thithi
}


export default function ThithiTransitionCard({ transitions, current_thithi }: ThithiTransitionCardProps) {
  return (
    transitions.map((transition, idx) => (
      <div key={`nakshatra-transition-${idx}`} className={`flex flex-col ${transition.thithi.en === current_thithi.en ? `bg-green-100` : `bg-white`}  border-l-4 border-l-amber-900 rounded-md p-4 m-2`} >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <p className="font-semibold text-xs text-[#554336] ">THITHI</p>
            <p className="font-medium text-base md:text-lg font-playfair-display">{transition.thithi.en} ({transition.thithi.paksha.en})</p>
          </div>
          <div className="flex">
            <MoonIcon className="text-amber-200 h-10 w-10" />
          </div>
        </div>

        <hr className="divide-y-4 divide-gray-800"></hr>
        <div className="flex flex-row items-center gap-2 mt-2">
          <Clock className="w-4 h-4" />
          <p className="text-sm font-inter align-text-top">{getFormattedDateTime(transition.start_time)} - {getFormattedDateTime(transition.end_time)}</p>
        </div>
      </div >
    ))
  )
}
