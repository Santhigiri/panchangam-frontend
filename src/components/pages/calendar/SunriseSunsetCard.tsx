import {
  differenceInMinutes,
  intervalToDuration,
  isBefore,
  isToday,
  parseISO,
  startOfDay,
} from "date-fns"
import { SunriseIcon, SunsetIcon } from "lucide-react"
import type { ISODatetime } from "@/api/schemas/panchangamData"
import type { ReactNode } from "react"
import { getFormattedTime } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

type SunriseSunsetProps = {
  sunrise: ISODatetime,
  sunset: ISODatetime
}

// An elliptical dome, not a true semicircle: a semicircle this wide would
// peak well above the viewBox (center_y - radius < 0) and get clipped by
// the SVG's own bounds right around solar noon, when the progress dot is
// near the top. Flattening the vertical radius keeps the whole arc, and
// the dot at any time of day, inside the visible box.
const ARC_CENTER_X = 150
const ARC_CENTER_Y = 90
const ARC_RADIUS_X = 130
const ARC_RADIUS_Y = 64
const ARC_START = { x: 20, y: 90 }

function pointOnArc(fraction: number): { x: number, y: number } {
  const angle = Math.PI * (1 - fraction)
  return {
    x: ARC_CENTER_X + ARC_RADIUS_X * Math.cos(angle),
    y: ARC_CENTER_Y - ARC_RADIUS_Y * Math.sin(angle),
  }
}

function arcPath(fraction: number): string {
  const { x, y } = pointOnArc(fraction)
  return `M${ARC_START.x},${ARC_START.y} A${ARC_RADIUS_X},${ARC_RADIUS_Y} 0 0 1 ${x},${y}`
}

export default function SunriseSunsetCard({ sunrise, sunset }: SunriseSunsetProps): ReactNode {
  const sunriseDate = parseISO(sunrise)
  const sunsetDate = parseISO(sunset)
  const now = new Date()

  const today = isToday(sunriseDate)
  const past = !today && isBefore(startOfDay(sunriseDate), startOfDay(now))

  const duration = intervalToDuration({ start: sunriseDate, end: sunsetDate })

  const totalMinutes = differenceInMinutes(sunsetDate, sunriseDate)
  const elapsedMinutes = differenceInMinutes(now, sunriseDate)
  const progress = totalMinutes > 0
    ? Math.min(1, Math.max(0, elapsedMinutes / totalMinutes))
    : 0

  const progressDot = pointOnArc(progress)

  return (
    <Card className="rounded-md py-4">
      <CardContent className="flex flex-col items-center gap-2 px-4">
        <div className="relative w-full max-w-[280px] h-[110px]">
          <svg viewBox="0 0 300 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path
              d={arcPath(1)}
              fill="none"
              className="stroke-border"
              strokeWidth={6}
              strokeLinecap="round"
            />
            {(today || past) && (
              <path
                d={arcPath(today ? progress : 1)}
                fill="none"
                className="stroke-primary"
                strokeWidth={6}
                strokeLinecap="round"
              />
            )}
            {today && (
              <circle
                cx={progressDot.x}
                cy={progressDot.y}
                r={6}
                className="fill-primary stroke-background"
                strokeWidth={2}
              />
            )}
          </svg>
          <div className="absolute bottom-0 left-0 flex flex-col items-start gap-0.5">
            <SunriseIcon className="h-5 w-5 text-primary" />
            <p className="font-inter text-muted-foreground text-[12px] font-semibold">SUNRISE</p>
            <p className="font-inter text-sm font-medium">{getFormattedTime(sunrise)}</p>
          </div>
          <div className="absolute bottom-0 right-0 flex flex-col items-end gap-0.5">
            <SunsetIcon className="h-5 w-5 text-primary" />
            <p className="font-inter text-muted-foreground text-[12px] font-semibold">SUNSET</p>
            <p className="font-inter text-sm font-medium">{getFormattedTime(sunset)}</p>
          </div>
        </div>
        <p className="font-inter text-xs text-muted-foreground">
          daylight · {duration.hours ?? 0}h {duration.minutes ?? 0}m
        </p>
      </CardContent>
    </Card>
  )
}
