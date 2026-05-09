import { Calendar } from "react-calendar"
import './calendar.css'
import { useState } from "react"
import { usePanchangam } from "@/hooks/usePanchangam"

export default function CalendarCustomDays() {
  const [activeDate, setActiveDate] = useState(new Date())

  const { data } = usePanchangam(activeDate)

  return (
    <div className="my-calendar h-auto w-full">
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

          return (
            <div className="flex h-full w-full flex-col">
              {/* top row */}
              {
                dateData.nakshatra === "Chothi" ? (
                  <p className="bg-amber-950 text-[12px] text-orange-300">
                    {"Chothi Theertha Yathra"}
                  </p>
                ) :
                  <p className=" text-[12px]  text-transparent">
                    {"dummy text"}
                  </p>
              }

              <div className="relative h-full w-full">
                <p className="text-2xl w-full text-center ">
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
                <div className="flex flex-row items-end justify-between w-full">
                  <p className="text-sm">
                    {dateData.malayalam_day}
                  </p>


                  <div className="flex-col">
                    <div className="text-center text-[12px] leading-none">
                      {dateData.kollavarsham_nakshatra}
                    </div>
                    <div className="text-center text-[10px] leading-none">
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
