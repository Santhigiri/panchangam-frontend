import { Calendar } from "react-calendar"
import "./calendar.css"
import { useMemo, useState, type ReactNode } from "react"
import { usePanchangam } from "@/hooks/usePanchangam"
import { ChevronLeft, ChevronRight, Clock, Landmark, MoonIcon, Star, SunIcon, SunriseIcon, SunsetIcon } from "lucide-react";
import type { ISODatetime, KollavarshamDate, Nakshatra, NakshatraTransition, SanthigiriSignificance, Thithi, ThithiTransition } from "@/api/schemas/panchangamData";


function getFormattedDate(datetime: string): string {

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'short', day: 'numeric'
  };

  const locale = 'en-IN'

  return new Date(datetime).toLocaleString(locale, options)
}

function getFormattedTime(datetime: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric', minute: 'numeric',
    hour12: false
  };

  const locale = 'en-IN'

  return new Date(datetime).toLocaleTimeString(locale, options)

}

function getFormattedDateTime(datetime: string | null): string {

  if (datetime === null) return ""

  const options: Intl.DateTimeFormatOptions = {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: 'numeric',
    hour12: true
  };

  const locale = 'en-IN'

  return new Date(datetime).toLocaleString(locale, options)
}

type DateHeaderProps = {
  date: Date,
  kv_date: KollavarshamDate
}

function DateHeader({ date, kv_date }: DateHeaderProps) {
  return (
    <div className="flex flex-col">
      <p className="font-playfair-display font-semibold text-2xl text-center col-span-2">{date.toLocaleDateString('default', { 'weekday': 'long' })}</p>
      <p className="text-md font-inter font-medium text-[#B22B1D] text-center"> {date.toLocaleDateString('default', { 'month': 'long' })} {date.getDate()}, {date.getFullYear()}</p>
      <p className="text-md font-inter font-medium text-[#B22B1D] text-center"> {kv_date.kv_month_name_en} {kv_date.kv_day}, {kv_date.kv_year}</p>
    </div>
  )
}


type SunriseSunsetProps = {
  sunrise: ISODatetime,
  sunset: ISODatetime
}

type MoonriseMoonsetProps = {
  moonrise: ISODatetime,
  moonset: ISODatetime
}

function SunriseSunsetCard({ sunrise, sunset }: SunriseSunsetProps): ReactNode {

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

type NakshatraTransitionCardProps = {
  transitions: NakshatraTransition[],
  current_nakshatra: Nakshatra
}

function NakshatraTransitionCard({ transitions, current_nakshatra }: NakshatraTransitionCardProps) {
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


type ThithiTransitionCardProps = {
  transitions: ThithiTransition[],
  current_thithi: Thithi
}


function ThithiTransitionCard({ transitions, current_thithi }: ThithiTransitionCardProps) {
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

export type AshramSignificanceProps = {
  significances: SanthigiriSignificance[]
}


function AshramSignificance({ significances }: AshramSignificanceProps) {
  return (
    significances.map((significance: SanthigiriSignificance, idx) => (
      <div key={`ashram-significance-${idx}`} className="flex flex-col p-4 gap-2 border-2 border-amber-800 rounded-md m-2">
        <div className="flex flex-row items-start gap-2">
          <Landmark className="w-4 h-4" />
          <p className="text-amber-800 text-[12px] font-bold">ASHRAM SIGNIFICANCE</p>
        </div>
        <p className="font-playfair-display font-bold">{significance.name}</p>
        <p className="font-inter text-xs md:text-sm max-w-full font-light" >{significance.description}</p>
      </div>
    ))
  )
}


function dateToKey(dt: Date) {

  return [
    dt.getFullYear(),
    String(dt.getMonth() + 1).padStart(2, "0"),
    String(dt.getDate()).padStart(2, "0"),
  ].join("-")
}



export default function CalendarCustLomDays() {
  const [activeDate, setActiveDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const { data: monthData, isLoading } = usePanchangam(activeDate)

  const selectedKey = [
    selectedDate.getFullYear(),
    String(selectedDate.getMonth() + 1).padStart(2, "0"),
    String(selectedDate.getDate()).padStart(2, "0"),
  ].join("-")

  const [monthStartDate, monthEndDate] = useMemo(() => {
    if (!monthData) return [null, null]


    return [
      new Date(activeDate.getFullYear(), activeDate.getMonth(), 1),
      new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0)
    ]
  }, [monthData])

  const startKey = monthStartDate
    ? [
      monthStartDate.getFullYear(),
      String(monthStartDate.getMonth() + 1).padStart(2, "0"),
      String(monthStartDate.getDate()).padStart(2, "0"),
    ].join("-")
    : ""

  const endKey = monthEndDate
    ? [
      monthEndDate.getFullYear(),
      String(monthEndDate.getMonth() + 1).padStart(2, "0"),
      String(monthEndDate.getDate()).padStart(2, "0"),
    ].join("-")
    : ""


  const selectedDateData = useMemo(() => {
    if (!monthData) return null
    return monthData[selectedKey as keyof typeof monthData]
  }, [monthData, selectedKey])


  const monthEvents = useMemo(() => {
    if (!monthData) return []
    const year = activeDate.getFullYear()
    const month = activeDate.getMonth()

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthDates = []
    for (let i = 1; i <= daysInMonth; i++) {
      monthDates.push(new Date(year, month, i))
    }
    return monthDates.flatMap(dt => {
      const key = dateToKey(dt)
      const dayData = monthData[key]
      if (!dayData) return null
      return dayData.santhigiri_significant_dates.map(e => ({
        dt,
        key,
        e
      }))
    })

  }, [monthData, activeDate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }


  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-3 gap-2 items-center md:items-start">
      <div className="md:col-span-2">
        <Calendar
          formatDay={() => ""}
          minDate={new Date(2021, 0, 1)}
          maxDate={new Date(2030, 11, 31)}
          prev2Label={null}
          next2Label={null}
          prevLabel={
            <ChevronLeft className="w-8 h-8 mx-8" />
          }
          nextLabel={
            <ChevronRight className="h-8 w-8 mx-8" />
          }
          calendarType="gregory"
          activeStartDate={activeDate}
          onClickDay={(day) => {
            setSelectedDate(day)
          }}
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) {
              setActiveDate(activeStartDate)
            }
          }}
          className="w-full"
          navigationLabel={({ date, label, locale, view }) => {
            if (!monthData) return label
            if (view !== "month") return label
            const start_ml_month = monthData[startKey as keyof typeof monthData]?.kv.kv_month_name_ml ?? ""
            const end_ml_month = monthData[endKey as keyof typeof monthData]?.kv.kv_month_name_ml ?? ""

            const ml_month = `${start_ml_month} / ${end_ml_month}`
            return (
              <div className="flex flex-col items-center leading-tight">
                <span className="text-lg font-bold text-amber-800">
                  {label}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {ml_month}
                </span>
              </div>
            )
          }}
          tileClassName={() => "custom-tile"}
          tileContent={({ date, view }) => {
            if (view !== "month") return null
            if (!monthData) return null

            const key = [
              date.getFullYear(),
              String(date.getMonth() + 1).padStart(2, "0"),
              String(date.getDate()).padStart(2, "0"),
            ].join("-")

            const dateData = monthData[key as keyof typeof monthData]

            if (!dateData) return null

            const isNeighbouringMonth =
              date.getMonth() !== activeDate.getMonth()

            const neighbouringMonthStyle =
              isNeighbouringMonth ? "opacity-40" : ""

            return (
              <div className={`flex h-full w-full flex-col  ${dateData.is_pournami ? "bg-moon" : ""}`}>
                {
                  dateData.kv.kv_day === 1 ? (
                    <p className="bg-amber-700 text-[10px] lg:text-[12px] text-orange-50">
                      {dateData.kv.kv_month_name_ml}
                    </p>
                  ) :
                    <p className="text-[10px] lg:text-[12px] text-transparent">
                      {dateData.kv.kv_month_name_ml}
                    </p>
                }
                <div className="relative h-full w-full">
                  <p className={`text-[14px] lg:text-2xl w-full text-center ${neighbouringMonthStyle} font-bold`}>
                    {date.getDate()}
                  </p>
                  <div className="flex flex-col lg:flex-row items-center lg:items-center justify-end lg:justify-between w-full p-2">
                    <p className={`text-[10px] lg:text-[14px] ${neighbouringMonthStyle} text-blue-600`}>
                      {dateData.kv.kv_day}
                    </p>
                    <div className="flex-col">
                      <div className={`text-center text-[10px] lg:text-[14px] leading-none ${neighbouringMonthStyle}`}>
                        {dateData.nakshatra.ml}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }}
        />
        <div className="grid grid-flow-rows auto-rows-min my-2">
          {
            monthEvents.map(event => {
              if (!event) return null
              return (
                <div className="flex text-amber-800 font-semibold font-inter text-xs md:text-sm flex-row gap4">
                  <p className="mx-2">{event.dt.getDate()}</p>
                  <p>{event.e.name}</p>
                </div>
              )

            })
          }
        </div>

      </div>
      <div className="md:col-span-1 w-full">
        {
          selectedDateData ? (
            <div className="grid grid-col-2 justify-items-stretch">
              <div className="col-span-2">
                <DateHeader
                  date={new Date(selectedDateData.date)}
                  kv_date={selectedDateData.kv}
                />
              </div>

              <div className="col-span-2 m-2">
                <SunriseSunsetCard
                  sunrise={selectedDateData.sunrise}
                  sunset={selectedDateData.sunset}
                />
              </div>

              {/*
                <div className="col-span-1 m-2">
                <MoonriseMoonsetCard
                  moonrise={selectedDateData.sunrise}
                  moonset={selectedDateData.sunset}
                />
              </div>
              */}

              <div className="col-span-2">
                <ThithiTransitionCard
                  transitions={selectedDateData.thithi_transitions}
                  current_thithi={selectedDateData.thithi}
                />
              </div>

              <div className="col-span-2">
                <NakshatraTransitionCard
                  transitions={selectedDateData.nakshatra_transitions}
                  current_nakshatra={selectedDateData.nakshatra}
                />
              </div>

              <div className="col-span-2">
                <AshramSignificance
                  significances={selectedDateData.santhigiri_significant_dates}
                />
              </div>

            </div>
          )
            :
            <div className="md:col-span-1 flex items-center justify-center min-h-40 md:min-h-100">
              <p className="text-center">
                Select a date to display details here
                test
                test
                test
              </p>
            </div>
        }
      </div>
    </div>
  )
}
