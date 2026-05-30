import useDayDetails from "@/hooks/useDayDetails";
import { addDays, format } from "date-fns";
import { CalendarIcon, ChevronDownIcon, ChevronLeft, ChevronRight } from "lucide-react";
import DateHeader from "../calendar/DateHeader";
import SunriseSunsetCard from "../calendar/SunriseSunsetCard";
import ThithiTransitionCard from "../calendar/ThithiTransitionCard";
import { NakshatraTransitionCard } from "../calendar/NakshatraTransitionCard";
import { AshramSignificance } from "../calendar/AshramSignificanceCard";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import './date-picker.css'
import { useState } from "react";
import TopAppBar from "@/components/shared/TopAppBar";
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants";


export default function DayDetailsPage() {
  const {
    activeDate,
    setActiveDate,
    activeDateData,
  } = useDayDetails();

  function getTomorrowData() {  // Fixed typo: getTommorowData → getTomorrowData
    setActiveDate(addDays(activeDate, 1));
  }

  function getYesterdayData() {
    setActiveDate(addDays(activeDate, -1));
  }

  const [datePickerOpen, setDatePickerOpen] = useState(false)
  console.log(`datePickerOpen: ${datePickerOpen}`)

  return (
    <div className="flex flex-col items-stretch">
      <TopAppBar
        title="Daily Panchangam"
        actions={
          <>
            <CalendarIcon onClick={() => setDatePickerOpen(!datePickerOpen)} >Select a date</CalendarIcon>
            <DatePicker
              startDate={CALENDAR_START_DATE}
              endDate={CALENDAR_END_DATE}
              open={datePickerOpen}
              onClickOutside={
                () =>
                  setDatePickerOpen(false)
              }
              className="hidden"
              popperPlacement="top-end"
              onSelect={
                (date) => {
                  if (date) {
                    setDatePickerOpen(false)
                    setActiveDate(date)
                  }
                }
              } />
          </>
        }
      />
      {activeDateData && (
        <div className="grid grid-cols-2 justify-items-stretch gap-4 p-2">  {/* Fixed: grid-col-2 → grid-cols-2 */}
          <div className="col-span-2">
            <div className="flex flex-row justify-center items-center">
              <ChevronLeft
                className="w-12 h-12 cursor-pointer"
                onClick={getYesterdayData}
              />
              <div className="flex-1">
                <DateHeader
                  date={new Date(activeDateData.date)}
                  kv_date={activeDateData.kv}
                />
              </div>
              <ChevronRight
                className="w-12 h-12 cursor-pointer"
                onClick={getTomorrowData}
              />
            </div>
          </div>

          <div className="col-span-2 m-2">
            <SunriseSunsetCard
              sunrise={activeDateData.sunrise}
              sunset={activeDateData.sunset}
            />
          </div>

          <div className="col-span-2">
            <ThithiTransitionCard
              transitions={activeDateData.thithi_transitions}
              current_thithi={activeDateData.thithi}
            />
          </div>

          <div className="col-span-2">
            <NakshatraTransitionCard
              transitions={activeDateData.nakshatra_transitions}
              current_nakshatra={activeDateData.nakshatra}
            />
          </div>

          <div className="col-span-2">
            <AshramSignificance
              significances={activeDateData.santhigiri_significant_dates}
            />
          </div>
        </div>
      )}
    </div>
  );
}
