import type { Nakshatra, NakshatraTransition } from "@/api/schemas/panchangamData"
import { getFormattedDateTime } from "@/lib/utils"
import { Clock, Star } from "lucide-react"

export type NakshatraTransitionCardProps = {
  transitions: NakshatraTransition[],
  current_nakshatra: Nakshatra
}

export function NakshatraTransitionCard({ transitions, current_nakshatra }: NakshatraTransitionCardProps) {
  return (
    transitions.map((transition, idx) => (
      <div key={`thithi-transition-${idx}`} className={`flex flex-col ${transition.nakshatra.en === current_nakshatra.en ? `bg-green-100` : `bg-white`}  border-l-4 border-l-amber-900 rounded-md p-4 m-2`} >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <p className="font-semibold text-xs text-[#554336] ">NAKSHATRA</p>
            <p className="font-medium text-base md:text-lg font-playfair-display">{transition.nakshatra.en}</p>
          </div>
          <div className="flex">
            <Star className="text-amber-200 h-10 w-10" />
          </div>
        </div>

        <hr className="divide-y-4 divide-gray-800"></hr>
        <div className="flex flex-row gap-2 mt-2 items-center">
          <Clock className="w-4 h-4" />
          <p className="text-sm font-inter"> {getFormattedDateTime(transition.start_time)} - {getFormattedDateTime(transition.end_time)}</p>
        </div>
      </div >
    ))

  )
}
