import type { ISODatetime } from "@/api/schemas/panchangamData"
import { getFormattedTime } from "@/lib/utils"
import { SunriseIcon, SunsetIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

type SunriseSunsetProps = {
  sunrise: ISODatetime,
  sunset: ISODatetime
}

export default function SunriseSunsetCard({ sunrise, sunset }: SunriseSunsetProps): ReactNode {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="col-span-1 py-3">
        <CardContent className="flex flex-row items-center gap-4 px-4">
          <SunriseIcon />
          <div className="flex flex-col">
            <p className="font-inter text-muted-foreground text-[12px] font-semibold">SUNRISE</p>
            <p className="font-inter text-muted-foreground text-[12px]">{getFormattedTime(sunrise)}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1 py-3">
        <CardContent className="flex flex-row items-center gap-4 px-4">
          <SunsetIcon />
          <div className="flex flex-col">
            <p className="font-inter text-muted-foreground text-[12px] font-semibold">SUNSET</p>
            <p className="font-inter text-muted-foreground text-[12px]">{getFormattedTime(sunset)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
