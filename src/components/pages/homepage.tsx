import { Calendar } from "react-calendar"
import "./calendar.css"
import { useMemo, useState } from "react"
import { usePanchangam } from "@/hooks/usePanchangam"


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
    hour12: true
  };

  const locale = 'en-IN'

  return new Date(datetime).toLocaleTimeString(locale, options)

}

function getFormattedDateTime(datetime: string | null): string {

  if (datetime === null) return ""

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: 'numeric',
    hour12: true
  };

  const locale = 'en-IN'

  return new Date(datetime).toLocaleString(locale, options)
}



export default function CalendarCustomDays() {
  const [activeDate, setActiveDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const { data } = usePanchangam(activeDate)

  const selectedKey = [
    selectedDate.getFullYear(),
    String(selectedDate.getMonth() + 1).padStart(2, "0"),
    String(selectedDate.getDate()).padStart(2, "0"),
  ].join("-")

  const selectedDateData = useMemo(() => {
    if (!data) return null
    return data[selectedKey as keyof typeof data]
  }, [data, selectedKey])

  return (
    <div className="h-auto w-full">
      <Calendar
        formatDay={() => ""}
        minDate={new Date(2020, 0, 1)}
        maxDate={new Date(2030, 11, 31)}
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
        className="h-full w-full"
        tileClassName={() => "custom-tile"}
        tileContent={({ date, view }) => {
          if (view !== "month") return null
          if (!data) return null

          const key = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
          ].join("-")

          const dateData = data[key as keyof typeof data]

          if (!dateData) return null

          const isNeighbouringMonth =
            date.getMonth() !== activeDate.getMonth()

          const neighbouringMonthStyle =
            isNeighbouringMonth ? "opacity-40" : ""

          return (
            <div className="flex h-full w-full flex-col">
              {
                dateData.kv.kv_day === 1 ? (
                  <p className="bg-green-800 text-[10px] lg:text-[14px] text-orange-300">
                    {dateData.kv.kv_month_name_ml}
                  </p>
                ) :
                  <p className="text-[10px] lg:text-[14px]  text-transparent">
                    {dateData.kv.kv_month_name_ml}
                  </p>
              }
              <div className="relative h-full w-full">
                <p className={`text-[12px] lg:text-2xl w-full text-center ${neighbouringMonthStyle}`}>
                  {date.getDate()}
                </p>
                <div className="absolute top-0 right-0">
                  {dateData.is_pournami && (
                    <img
                      src="/moon.png"
                      alt="full-moon"
                      className="w-6 h-6"
                    />
                  )}
                </div>
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-end lg:justify-between w-full p-2">
                  <p className={`text-[10px] lg:text-sm ${neighbouringMonthStyle} text-blue-600`}>
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

      {selectedDateData && (
        <div className="flex flex-col gap-1 border p-4 text-[12px] lg:text-[14px]">
          <div className="mt-4 grid grid-cols-3">
            <div>Date: {getFormattedDate(selectedDateData.date)}</div>
            <div>Malayalam Date: {selectedDateData.kv.kv_day}</div>
            <div>Malayalam Month: {selectedDateData.kv.kv_month_name_ml}</div>
            <div>Malayalam Year: {selectedDateData.kv.kv_year}</div>
            <div>Nakshatra: {selectedDateData.nakshatra.ml}</div>
            <div>Nazhika from sunrise: {selectedDateData.nazhika_from_sunrise}</div>
            <div>Thithi: {selectedDateData.thithi.ml} {selectedDateData.thithi.paksha.ml}</div>
            <div>Sunrise: {getFormattedTime(selectedDateData.sunrise)}</div>
            <div>Sunset: {getFormattedTime(selectedDateData.sunset)}</div>
            <div>Is Pournami: {String(selectedDateData.is_pournami)}</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-sm lg:text-md font-semibold">Thithi Transitions</p>
              {
                selectedDateData.thithi_transitions.map((thithi, index) => (
                  <p key={`thithi-${index}`}>{thithi.thithi.ml} {thithi.thithi.paksha.ml} {getFormattedDateTime(thithi.start_time)} - {thithi.end_time ? getFormattedDateTime(thithi.end_time) : ""}</p>
                ))
              }
            </div>

            <div className="flex flex-col">
              <p className="text-sm lg:text-md font-semibold">Nakshatra Transitions</p>
              {
                selectedDateData.nakshatra_transitions.map((nakshatra, index) => (
                  <p key={`nakshatra-${index}`}>{nakshatra.nakshatra.ml} {getFormattedDateTime(nakshatra.start_time)} - {nakshatra.end_time ? getFormattedDateTime(nakshatra.end_time) : ""}</p>
                ))
              }
            </div>
            {
              selectedDateData.santhigiri_significant_dates.length > 0 && (

                <div className="flex flex-col">
                  <p className="text-sm lg:text-md font-semibold">Santhigiri Significant Days</p>
                  {
                    selectedDateData.santhigiri_significant_dates.map((significance, index) => (
                      <p key={`significance-${index}`}>{significance.name}</p>
                    ))
                  }
                </div>
              )
            }
          </div>
        </div>
      )}
    </div>
  )
}
