import useDayDetails from "@/hooks/useDayDetails";
import { addDays, format } from "date-fns";
import { getLocalTimeZone, type CalendarDate } from "@internationalized/date"

import { CalendarIcon, ChevronDownIcon, ChevronLeft, ChevronRight } from "lucide-react";
import DateHeader from "../calendar/DateHeader";
import SunriseSunsetCard from "../calendar/SunriseSunsetCard";
import ThithiTransitionCard from "../calendar/ThithiTransitionCard";
import { NakshatraTransitionCard } from "../calendar/NakshatraTransitionCard";
import { AshramSignificance } from "../calendar/AshramSignificanceCard";
import React, { useState } from "react";
import TopAppBar from "@/components/shared/TopAppBar";
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";



export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}

export default function DayDetailsPage() {
  const { activeDate, setActiveDate, activeDateData } = useDayDetails();

  return (
    <div className="flex flex-col items-stretch">
      <TopAppBar
        title="Daily Panchangam"
      />
      <DatePickerDemo />
      {activeDateData && (

        <div className="grid grid-cols-2 justify-items-stretch gap-4 p-2">
          <div className="col-span-2">
            <div className="flex flex-row justify-center items-center">
              <ChevronLeft
                className="w-12 h-12 cursor-pointer"
                onClick={() => setActiveDate(addDays(activeDate, -1))}
              />
              <div className="flex-1">
                <DateHeader
                  date={new Date(activeDateData.date)}
                  kv_date={activeDateData.kv}
                />
              </div>
              <ChevronRight
                className="w-12 h-12 cursor-pointer"
                onClick={() => setActiveDate(addDays(activeDate, 1))}
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
