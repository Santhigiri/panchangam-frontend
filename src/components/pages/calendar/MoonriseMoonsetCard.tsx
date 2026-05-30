import type { ISODatetime } from "@/api/schemas/panchangamData"
import { getFormattedTime } from "@/lib/utils"
import { MoonIcon } from "lucide-react"
import type { ReactNode } from "react"

type MoonriseMoonsetProps = {
  moonrise: ISODatetime,
  moonset: ISODatetime
}

function MoonriseMoonsetCard({ moonrise, moonset }: MoonriseMoonsetProps): ReactNode {

  return (
    <div className="bg-white rounded-md w-full">
      <div className="flex flex-row items-center gap-4 p-2">
        <MoonIcon />
        <div className="flex flex-col">
          <p className="font-inter text-[#554336] text-[12px] font-semibold">MOON</p>
          <p className="font-inter text-[#554336] text-[12px]">
            {getFormattedTime(moonrise)} - {getFormattedTime(moonset)}{/* TODO: uncomment when values are available */}
          </p>
        </div>

      </div>
    </div>
  )
}
