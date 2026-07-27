import { createContext, useContext } from "react"
import { ChevronLeft, ChevronRight, InfoIcon, SunriseIcon, SunsetIcon } from "lucide-react";
import DateHeader from "./DateHeader";
import type { ComponentProps } from "react"
import type { PanchangamDayData } from "@/api/schemas/panchangamData";
import type { DayButton } from "react-day-picker";
import { dateToKey, useCalendarPanchangam } from "@/hooks/homepage/useCalendarPanchangam";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants";
import { cn, getFormattedTime } from "@/lib/utils";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import TopAppBar from "@/components/shared/TopAppBar";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const YEAR_OPTIONS = Array.from(
  { length: CALENDAR_END_DATE.getFullYear() - CALENDAR_START_DATE.getFullYear() + 1 },
  (_, i) => CALENDAR_START_DATE.getFullYear() + i
)

type CalendarContextData = {
  monthData: Record<string, PanchangamDayData> | undefined
  activeMonth: Date
  setActiveMonth: (date: Date) => void
  startKey: string
  endKey: string
}

const CalendarDataContext = createContext<CalendarContextData | null>(null)

function DayDetailsHoverContent({ date, data }: { date: Date; data: PanchangamDayData }) {
  return (
    <div className="flex flex-col gap-2">
      <DateHeader date={date} kv_date={data.kv} />
      <Separator />
      <div className="flex flex-row justify-between text-xs font-inter text-[#554336]">
        <div className="flex items-center gap-1.5">
          <SunriseIcon className="h-3.5 w-3.5" />
          {getFormattedTime(data.sunrise)}
        </div>
        <div className="flex items-center gap-1.5">
          <SunsetIcon className="h-3.5 w-3.5" />
          {getFormattedTime(data.sunset)}
        </div>
      </div>
      <div className="flex flex-col gap-0.5 text-xs">
        <p><span className="font-semibold">Thithi:</span> {data.thithi.en} ({data.thithi.paksha.en})</p>
        <p><span className="font-semibold">Nakshatra:</span> {data.nakshatra.en}</p>
      </div>
      {data.santhigiri_significant_dates.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-1">
            {data.santhigiri_significant_dates.map((significance) => (
              <p key={significance.name} className="text-xs font-semibold text-amber-800">
                {significance.name}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function PanchangamDayButton({ day, modifiers, className, children: _children, ...props }: ComponentProps<typeof DayButton>) {
  const ctx = useContext(CalendarDataContext)
  const key = dateToKey(day.date)
  const dateData = ctx?.monthData?.[key]
  const isPournami = dateData?.santhigiri_significant_dates.some(e => e.name === "Pournami") ?? false
  const isNeighbouringMonth = ctx ? day.date.getMonth() !== ctx.activeMonth.getMonth() : false

  const button = (
    <CalendarDayButton
      day={day}
      modifiers={modifiers}
      className={cn(
        "aspect-auto h-full min-h-20 md:min-h-28 min-w-0 items-start justify-start p-0 overflow-hidden",
        isPournami && "bg-moon",
        className
      )}
      {...props}
    >
      {dateData?.kv.kv_day === 1 ? (
        <p className="bg-amber-700 text-[10px] lg:text-[12px] text-orange-50 w-full text-center leading-snug break-words">
          {dateData.kv.kv_month_name_ml}
        </p>
      ) : (
        <div className="h-4" />
      )}
      <p className={cn("text-[14px] lg:text-3xl w-full text-center align-middle mt-4 font-bold", isNeighbouringMonth && "opacity-40")}>
        {day.date.getDate()}
      </p>
      <div className={cn("flex justify-between w-full min-w-0 gap-1 pb-2 px-1 mt-auto", isNeighbouringMonth && "opacity-40")}>
        <p className="text-[8px] lg:text-[14px] text-blue-600 shrink-0">{dateData?.kv.kv_day}</p>
        <p className="text-[8px] lg:text-[14px] leading-none text-right truncate">{dateData?.nakshatra.ml}</p>
      </div>
    </CalendarDayButton>
  )

  if (!dateData) return button

  return (
    <HoverCard openDelay={150} closeDelay={50}>
      <HoverCardTrigger asChild>{button}</HoverCardTrigger>
      <HoverCardContent className="w-72 pointer-events-none">
        <DayDetailsHoverContent date={day.date} data={dateData} />
      </HoverCardContent>
    </HoverCard>
  )
}

function PanchangamMonthCaption({ calendarMonth }: { calendarMonth: { date: Date }; displayIndex: number }) {
  const ctx = useContext(CalendarDataContext)
  const startML = ctx?.monthData?.[ctx.startKey]?.kv.kv_month_name_ml ?? ""
  const endML = ctx?.monthData?.[ctx.endKey]?.kv.kv_month_name_ml ?? ""

  const previousMonth = new Date(calendarMonth.date.getFullYear(), calendarMonth.date.getMonth() - 1, 1)
  const nextMonth = new Date(calendarMonth.date.getFullYear(), calendarMonth.date.getMonth() + 1, 1)
  const canGoPrevious = previousMonth >= CALENDAR_START_DATE
  const canGoNext = nextMonth <= CALENDAR_END_DATE

  return (
    <div className="flex h-auto w-full flex-col items-center gap-1 py-2">
      <div className="flex w-full items-center justify-between px-2">
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Previous month"
          disabled={!canGoPrevious}
          onClick={() => ctx?.setActiveMonth(previousMonth)}
          className="text-amber-800 hover:text-amber-800 [&_svg]:size-6"
        >
          <ChevronLeft />
        </Button>
        <div className="flex items-center gap-1">
          <Select
            value={String(calendarMonth.date.getMonth())}
            onValueChange={(value) =>
              ctx?.setActiveMonth(new Date(calendarMonth.date.getFullYear(), Number(value), 1))
            }
          >
            <SelectTrigger
              aria-label="Month"
              className="h-auto gap-1 border-none bg-transparent p-0 text-lg font-bold text-amber-800 shadow-none hover:bg-transparent focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent [&_svg]:text-amber-800"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((name, index) => (
                <SelectItem key={name} value={String(index)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(calendarMonth.date.getFullYear())}
            onValueChange={(value) =>
              ctx?.setActiveMonth(new Date(Number(value), calendarMonth.date.getMonth(), 1))
            }
          >
            <SelectTrigger
              aria-label="Year"
              className="h-auto gap-1 border-none bg-transparent p-0 text-lg font-bold text-amber-800 shadow-none hover:bg-transparent focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent [&_svg]:text-amber-800"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Next month"
          disabled={!canGoNext}
          onClick={() => ctx?.setActiveMonth(nextMonth)}
          className="text-amber-800 hover:text-amber-800 [&_svg]:size-6"
        >
          <ChevronRight />
        </Button>
      </div>
      {(startML || endML) && (
        <span className="text-xs text-muted-foreground font-medium">{startML} / {endML}</span>
      )}
    </div>
  )
}

export default function CalendarCustomDays() {
  const {
    activeDate,
    setActiveDate,
    monthData,
    isLoading,
    monthEvents,
    startKey,
    endKey,
  } = useCalendarPanchangam();

  if (isLoading) {
    return (
      <div className="flex flex-col items-stretch">
        <TopAppBar title="Calendar" />
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-stretch">
      <TopAppBar title="Calendar" />
      <CalendarDataContext.Provider value={{ monthData, activeMonth: activeDate, setActiveMonth: setActiveDate, startKey, endKey }}>
        <div className="w-full flex flex-col gap-2 items-center">
          <div className="w-full">
            <Calendar
              mode="single"
              month={activeDate}
              onMonthChange={setActiveDate}
              disabled={(date) => date < CALENDAR_START_DATE || date > CALENDAR_END_DATE}
              showOutsideDays
              className="w-full max-w-full overflow-hidden rounded-2xl border-2 border-[#99ab86] p-0"
              classNames={{
                months: "w-full",
                month: "w-full flex flex-col gap-0",
                month_caption: "flex w-full items-center justify-center border-b border-[#99ab86]",
                // grid-cols-7 (repeat(7, minmax(0, 1fr))) rather than flex — the
                // explicit 0 track minimum makes every column truly equal-width
                // regardless of content, instead of fighting per-item min-width.
                weekdays: "grid grid-cols-7 bg-[#E4E4CC] border-b border-[#99ab86]",
                weekday: "overflow-hidden text-center text-xs font-bold py-2 capitalize",
                week: "grid grid-cols-7 border-b border-[#99ab86] last:border-b-0",
                day: "group/day relative overflow-hidden border-r border-[#99ab86] last:border-r-0 p-0 select-none",
                today: "bg-[#c3d4a8]",
                outside: "",
                disabled: "opacity-30",
              }}
              components={{
                DayButton: PanchangamDayButton,
                MonthCaption: PanchangamMonthCaption,
                Nav: () => <></>,
              }}
            />
            <div className="grid grid-flow-rows auto-rows-min my-2 gap-1">
              {monthEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="flex flex-row items-center gap-4 border-b border-amber-800/20 px-2 py-2 last:border-b-0 text-amber-800 font-semibold font-inter text-xs md:text-sm"
                >
                  <p>{event.dt.getDate()}</p>
                  <p>{event.e.name}</p>
                  <HoverCard openDelay={150} closeDelay={50}>
                    <HoverCardTrigger asChild>
                      <button
                        type="button"
                        aria-label={`${event.e.name} details`}
                        className="text-amber-800/70 hover:text-amber-800"
                      >
                        <InfoIcon className="h-4 w-4" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72">
                      <p className="font-playfair-display font-bold text-amber-800">{event.e.name}</p>
                      <p className="mt-1 font-inter text-xs font-normal text-muted-foreground md:text-sm">
                        {event.e.description}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CalendarDataContext.Provider>
    </div>
  )
}
