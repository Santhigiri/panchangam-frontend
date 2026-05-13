import { Calendar } from "react-calendar"
import './calendar.css'
import { useState } from "react"
import { usePanchangam } from "@/hooks/usePanchangam"

export default function CalendarCustomDays() {
  const [activeDate, setActiveDate] = useState(new Date())

  const { data } = usePanchangam(activeDate)

  return (
    <div className="h-auto w-full">
      <Calendar
        formatDay={() => ""}
        calendarType="gregory"
        activeStartDate={activeDate}
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
          const isNeighbouringMonth = date.getMonth() !== activeDate.getMonth()
          const neighbouringMonthStyle = isNeighbouringMonth ? `opacity-40` : ``

          return (
            <div className="flex h-full w-full flex-col">
              {
                dateData.nakshatra === "Chothi" ? (
                  <p className="bg-green-800 text-[12px] text-orange-300">
                    {"Chothi Theertha Yathra"}
                  </p>
                ) :
                  <p className=" text-[12px]  text-transparent">
                    {"dummy text"}
                  </p>
              }
              <div className="relative h-full w-full">
                <p className={`text-2xl w-full text-center ${neighbouringMonthStyle}`}>
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
                <div className="flex flex-row items-end justify-between w-full p-2">
                  <p className={`text-sm ${neighbouringMonthStyle}`}>
                    {dateData.malayalam_day}
                  </p>
                  <div className="flex-col">
                    <div className={`text-center text-[10px] leading-none ${neighbouringMonthStyle}`}>
                      {dateData.nakshatra}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}
