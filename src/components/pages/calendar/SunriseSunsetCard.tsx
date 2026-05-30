import type { ISODatetime } from "@/api/schemas/panchangamData"
import { getFormattedTime } from "@/lib/utils"
import { SunriseIcon, SunsetIcon } from "lucide-react"
import type { ReactNode } from "react"

type SunriseSunsetProps = {
  sunrise: ISODatetime,
  sunset: ISODatetime
}

export default function SunriseSunsetCard({ sunrise, sunset }: SunriseSunsetProps): ReactNode {

  return (
    <div className="grid grid-cols-2 justify-items-stretch gap-4">
      <div className="bg-white rounded-md w-full col-span-1">
        <div className="flex flex-row items-center gap-4 p-2">
          <SunriseIcon />
          <div className="flex flex-col">
            <p className="font-inter text-[#554336] text-[12px] font-semibold">SUNRISE</p>
            <p className="font-inter text-[#554336] text-[12px]">
              {getFormattedTime(sunrise)}
            </p>
          </div>

        </div>
      </div>
      <div className="bg-white rounded-md w-full col-span-1">

        <div className="flex flex-row items-center gap-4 p-2">
          <SunsetIcon />
          <div className="flex flex-col">
            <p className="font-inter text-[#554336] text-[12px] font-semibold">SUNSET</p>
            <p className="font-inter text-[#554336] text-[12px]">
              {getFormattedTime(sunset)}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
