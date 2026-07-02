import { Calendar } from "react-calendar"
import "./calendar.css"
import { ChevronLeft, ChevronRight } from "lucide-react";
import DateHeader from "./DateHeader";
import SunriseSunsetCard from "./SunriseSunsetCard";
import ThithiTransitionCard from "./ThithiTransitionCard";
import { NakshatraTransitionCard } from "./NakshatraTransitionCard";
import { AshramSignificance } from "./AshramSignificanceCard";
import { useCalendarPanchangam } from "@/hooks/homepage/useCalendarPanchangam";
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants";


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
    monthStartDate,
  } = useCalendarPanchangam();


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
          minDate={CALENDAR_START_DATE}
          maxDate={CALENDAR_END_DATE}
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
              <div className={`flex h-full w-full flex-col  ${dateData.santhigiri_significant_dates.some(event => event.name === "Pournami") ? "bg-moon" : ""}`}>
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
                <div className="h-full w-full">
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
              </p>
            </div>
        }
      </div>
    </div>
  )
}
