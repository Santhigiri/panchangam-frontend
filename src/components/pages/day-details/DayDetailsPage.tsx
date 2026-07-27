import useDayDetails from "@/hooks/useDayDetails";
import { addDays } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import DateHeader from "../calendar/DateHeader";
import SunriseSunsetCard from "../calendar/SunriseSunsetCard";
import ThithiTransitionCard from "../calendar/ThithiTransitionCard";
import { NakshatraTransitionCard } from "../calendar/NakshatraTransitionCard";
import { AshramSignificance } from "../calendar/AshramSignificanceCard";
import { useState } from "react";
import TopAppBar from "@/components/shared/TopAppBar";
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function DayDetailsPage() {
  const { activeDate, setActiveDate, activeDateData } = useDayDetails();
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <div className="flex flex-col items-stretch">
      <TopAppBar
        title="Daily Panchangam"
        actions={
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Pick a date">
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="end"
              onOpenAutoFocus={(event) => event.preventDefault()}
            >
              <Calendar
                mode="single"
                selected={activeDate}
                defaultMonth={activeDate}
                startMonth={CALENDAR_START_DATE}
                endMonth={CALENDAR_END_DATE}
                disabled={(date) =>
                  date < CALENDAR_START_DATE || date > CALENDAR_END_DATE
                }
                onSelect={(date) => {
                  if (date) {
                    setActiveDate(date);
                    setDatePickerOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        }
      />
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
                  date={activeDate}
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
