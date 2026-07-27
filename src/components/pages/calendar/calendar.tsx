import { createContext, useContext, type ComponentProps } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react";
import DateHeader from "./DateHeader";
import SunriseSunsetCard from "./SunriseSunsetCard";
import ThithiTransitionCard from "./ThithiTransitionCard";
import { NakshatraTransitionCard } from "./NakshatraTransitionCard";
import { AshramSignificance } from "./AshramSignificanceCard";
import { useCalendarPanchangam, dateToKey } from "@/hooks/homepage/useCalendarPanchangam";
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import type { PanchangamDayData } from "@/api/schemas/panchangamData";
import { cn } from "@/lib/utils";
import type { DayButton } from "react-day-picker";

type CalendarContextData = {
  monthData: Record<string, PanchangamDayData> | undefined
  activeMonth: Date
  startKey: string
  endKey: string
}

const CalendarDataContext = createContext<CalendarContextData | null>(null)

function PanchangamDayButton({ day, modifiers, className, children: _children, ...props }: ComponentProps<typeof DayButton>) {
  const ctx = useContext(CalendarDataContext)
  const key = dateToKey(day.date)
  const dateData = ctx?.monthData?.[key]
  const isPournami = dateData?.santhigiri_significant_dates.some(e => e.name === "Pournami") ?? false
  const isNeighbouringMonth = ctx ? day.date.getMonth() !== ctx.activeMonth.getMonth() : false

  return (
    <CalendarDayButton
      day={day}
      modifiers={modifiers}
      className={cn(
        "aspect-auto h-full min-h-20 md:min-h-28 items-start justify-start p-0 overflow-hidden",
        isPournami && "bg-moon",
        className
      )}
      {...props}
    >
      {dateData?.kv.kv_day === 1 ? (
        <p className="bg-amber-700 text-[10px] lg:text-[12px] text-orange-50 w-full text-center leading-snug">
          {dateData.kv.kv_month_name_ml}
        </p>
      ) : (
        <div className="h-4" />
      )}
      <p className={cn("text-[14px] lg:text-2xl w-full text-center font-bold", isNeighbouringMonth && "opacity-40")}>
        {day.date.getDate()}
      </p>
      <div className={cn("flex justify-between w-full px-1 mt-auto", isNeighbouringMonth && "opacity-40")}>
        <p className="text-[10px] lg:text-[14px] text-blue-600">{dateData?.kv.kv_day}</p>
        <p className="text-[10px] lg:text-[14px] leading-none text-right">{dateData?.nakshatra.ml}</p>
      </div>
    </CalendarDayButton>
  )
}

function PanchangamMonthCaption({ calendarMonth }: { calendarMonth: { date: Date }; displayIndex: number }) {
  const ctx = useContext(CalendarDataContext)
  const startML = ctx?.monthData?.[ctx.startKey]?.kv.kv_month_name_ml ?? ""
  const endML = ctx?.monthData?.[ctx.endKey]?.kv.kv_month_name_ml ?? ""
  const label = calendarMonth.date.toLocaleDateString("default", { month: "long", year: "numeric" })

  return (
    <div className="flex h-12 w-full items-center justify-center px-10">
      <div className="flex flex-col items-center leading-tight">
        <span className="text-lg font-bold text-amber-800">{label}</span>
        {(startML || endML) && (
          <span className="text-xs text-muted-foreground font-medium">{startML} / {endML}</span>
        )}
      </div>
    </div>
  )
}

export default function CalendarCustomDays() {
  const {
    activeDate,
    setActiveDate,
    selectedDate,
    setSelectedDate,
    monthData,
    isLoading,
    selectedDateData,
    monthEvents,
    startKey,
    endKey,
  } = useCalendarPanchangam();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <CalendarDataContext.Provider value={{ monthData, activeMonth: activeDate, startKey, endKey }}>
      <div className="w-full flex flex-col md:grid md:grid-cols-3 gap-2 items-center md:items-start">
        <div className="md:col-span-2 w-full">
          <Calendar
            mode="single"
            month={activeDate}
            onMonthChange={setActiveDate}
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            disabled={(date) => date < CALENDAR_START_DATE || date > CALENDAR_END_DATE}
            showOutsideDays
            className="w-full rounded-2xl border-2 border-[#99ab86] p-0"
            classNames={{
              months: "w-full",
              month: "w-full flex flex-col gap-0",
              nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between px-2",
              button_previous: "size-8 p-0 rounded-md hover:bg-[#e4e4cc] opacity-70 hover:opacity-100",
              button_next: "size-8 p-0 rounded-md hover:bg-[#e4e4cc] opacity-70 hover:opacity-100",
              month_caption: "flex w-full items-center justify-center border-b border-[#99ab86]",
              weekdays: "flex w-full bg-[#E4E4CC] border-b border-[#99ab86]",
              weekday: "flex-1 text-center text-xs font-bold py-2 capitalize",
              week: "flex w-full border-b border-[#99ab86] last:border-b-0",
              day: "group/day relative flex-1 border-r border-[#99ab86] last:border-r-0 p-0 select-none",
              today: "bg-[#c3d4a8]",
              outside: "",
              disabled: "opacity-30",
              selected: "",
            }}
            components={{
              DayButton: PanchangamDayButton,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              MonthCaption: PanchangamMonthCaption as any,
              Chevron: ({ orientation }) => {
                if (orientation === "left") return <ChevronLeft className="size-4" />
                if (orientation === "right") return <ChevronRight className="size-4" />
                return <></>
              },
            }}
          />
          <div className="grid grid-flow-rows auto-rows-min my-2">
            {monthEvents.map((event, idx) => {
              if (!event) return null
              return (
                <div key={idx} className="flex text-amber-800 font-semibold font-inter text-xs md:text-sm flex-row gap-4">
                  <p className="mx-2">{event.dt.getDate()}</p>
                  <p>{event.e.name}</p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
      <div className="md:col-span-1 w-full">
        {
          selectedDateData ? (
            <div className="grid grid-col-2 justify-items-stretch">
              <div className="col-span-2">
                <DateHeader
                  date={selectedDate}
                  kv_date={selectedDateData.kv}
                />
              </div>

              <div className="col-span-2 m-2">
                <SunriseSunsetCard
                  sunrise={selectedDateData.sunrise}
                  sunset={selectedDateData.sunset}
                />
              </div>
              <ThithiTransitionCard
                transitions={selectedDateData.thithi_transitions}
                current_thithi={selectedDateData.thithi}
              />
              <NakshatraTransitionCard
                transitions={selectedDateData.nakshatra_transitions}
                current_nakshatra={selectedDateData.nakshatra}
              />
              <AshramSignificance
                significances={selectedDateData.santhigiri_significant_dates}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-40 md:min-h-100">
              <p className="text-center text-muted-foreground">Select a date to display details here</p>
            </div>
          )}
        </div>
      </div>
    </CalendarDataContext.Provider>
  )
}
