import { Calendar } from "react-calendar"
import "./calendar.css"
import { useMemo, useState } from "react"
import { usePanchangam } from "@/hooks/usePanchangam"

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
              <p className="text-2xl text-center">
                {date.getDate()}
              </p>

              {dateData.is_pournami && (
                <img
                  src="/moon.png"
                  alt="full-moon"
                  className="w-6 h-6"
                />
              )}

              <p className={`text-sm ${neighbouringMonthStyle}`}>
                {dateData.calculated_ml_day}
              </p>

              <p className={`text-[10px] ${neighbouringMonthStyle}`}>
                {dateData.nakshatra}
              </p>
            </div>
          )
        }}
      />

      {selectedDateData && (
        <div className="mt-4 grid grid-cols-3 gap-1 border p-4">
          <div>Date: {selectedDateData.date.split('T')[0]}</div>
          <div>Malayalam Date: {selectedDateData.calculated_ml_day}</div>
          <div>Malayalam Month: {selectedDateData.calculated_ml_month}</div>
          <div>Malayalam Year: {selectedDateData.calculated_ml_year}</div>
          <div>Nakshatra: {selectedDateData.nakshatra}</div>
          <div>Thithi: {selectedDateData.thithi}</div>
          <div>Sunrise: {selectedDateData.sunrise}</div>
          <div>Sunset: {selectedDateData.sunset}</div>
          <div>Is Pournami: {String(selectedDateData.is_pournami)}</div>
        </div>
      )}
    </div>
  )
}
