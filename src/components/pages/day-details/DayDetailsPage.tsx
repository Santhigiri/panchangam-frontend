import { addDays } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import DateHeader from "../calendar/DateHeader";
import SunriseSunsetCard from "../calendar/SunriseSunsetCard";
import ThithiTransitionCard from "../calendar/ThithiTransitionCard";
import { NakshatraTransitionCard } from "../calendar/NakshatraTransitionCard";
import UpcomingEventsCard from "../calendar/UpcomingEventsCard";
import GuruvaniCard from "./GuruvaniCard";
import type { DayButton } from "react-day-picker";
import type { ComponentProps } from "react";
import TopAppBar from "@/components/shared/TopAppBar";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useHomePanchangam } from "@/hooks/homepage/useHomePanchangam";
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Selected takes the color today used to have (amber-700) and today takes
// the color selected used to have (the primary saffron) — inverted on
// purpose so the two states read distinctly from each other.
function DatePickerDayButton({ className, modifiers, ...props }: ComponentProps<typeof DayButton>) {
  // The day cell goes rounded-none specifically when today AND selected
  // coincide (see the `today` classNames override below) — the button
  // itself defaults to rounded-md from the base Button component with no
  // matching override, so without this the cell's orange background peeks
  // through as triangles in the corners where the two roundings disagree.

  return (
    <CalendarDayButton
      modifiers={modifiers}
      className={cn(
        "data-[selected-single=true]:bg-amber-700 data-[selected-single=true]:text-white",
        className
      )}
      {...props}
    />
  )
}

export default function DayDetailsPage() {
  const { activeDate, setActiveDate, activeDateData, upcomingEvents } = useHomePanchangam();
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
                captionLayout="dropdown"
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
                classNames={{
                  today: "rounded-lg bg-primary text-primary-foreground font-semibold data-[selected=true]:bg-transparent",
                }}
                components={{
                  DayButton: DatePickerDayButton,
                }}
              />
            </PopoverContent>
          </Popover>
        }
      />

      <div className="grid grid-cols-2 justify-items-stretch gap-2">

        {activeDateData && (
          <>
            <div className="col-span-2">
              <div className="flex flex-row justify-center items-center">
                <ChevronLeft
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => setActiveDate(addDays(activeDate, -1))}
                />
                <div className="flex-1">
                  <DateHeader
                    date={activeDate}
                    kv_date={activeDateData.kv}
                  />
                </div>
                <ChevronRight
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => setActiveDate(addDays(activeDate, 1))}
                />
              </div>
            </div>
            <div className="col-span-2">
              <GuruvaniCard />
            </div>

            <div className="col-span-2">
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
              <UpcomingEventsCard events={upcomingEvents} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
