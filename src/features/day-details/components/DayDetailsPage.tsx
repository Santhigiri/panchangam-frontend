import { addDays } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import SunriseSunsetCard from "./SunriseSunsetCard";
import SunriseSunsetCardSkeleton from "./SunriseSunsetCardSkeleton";
import ThithiTransitionCard from "./ThithiTransitionCard";
import { NakshatraTransitionCard } from "./NakshatraTransitionCard";
import { CompactTransitionRowSkeleton } from "./CompactTransitionRowSkeleton";
import UpcomingEventsCard from "./UpcomingEventsCard";
import UpcomingEventsCardSkeleton from "./UpcomingEventsCardSkeleton";
import GuruvaniCard from "./GuruvaniCard";
import type { DayButton } from "react-day-picker";
import type { ComponentProps } from "react";
import DateHeaderSkeleton from "@/features/panchangam/components/DateHeaderSkeleton";
import DateHeader from "@/features/panchangam/components/DateHeader";
import TopAppBar from "@/components/shared/TopAppBar";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useHomePanchangam } from "@/features/day-details/hooks/useHomePanchangam";
import { useLocalSunriseSunset } from "@/features/day-details/hooks/useLocalSunriseSunset";
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Selected takes the color today used to have (secondary) and today takes
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
        "data-[selected-single=true]:bg-secondary data-[selected-single=true]:text-secondary-foreground",
        className
      )}
      {...props}
    />
  )
}

export default function DayDetailsPage() {
  const { activeDate, setActiveDate, activeDateData, upcomingEvents, isLoading } = useHomePanchangam();
  const { sunrise, sunset, timeZone } = useLocalSunriseSunset(activeDate);
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

        <div className="col-span-2">
          <div className="flex flex-row justify-center items-center">
            <ChevronLeft
              className="w-8 h-8 cursor-pointer"
              onClick={() => setActiveDate(addDays(activeDate, -1))}
            />
            <div className="flex-1">
              {activeDateData ? (
                <DateHeader
                  date={activeDate}
                  kv_date={activeDateData.kv}
                />
              ) : (
                <DateHeaderSkeleton />
              )}
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
          {sunrise && sunset ? (
            <SunriseSunsetCard sunrise={sunrise} sunset={sunset} timeZone={timeZone} />
          ) : (
            <SunriseSunsetCardSkeleton />
          )}
        </div>

        <div className="col-span-2">
          {activeDateData ? (
            <ThithiTransitionCard
              transitions={activeDateData.thithi_transitions}
              current_thithi={activeDateData.thithi}
            />
          ) : (
            <CompactTransitionRowSkeleton />
          )}
        </div>

        <div className="col-span-2">
          {activeDateData ? (
            <NakshatraTransitionCard
              transitions={activeDateData.nakshatra_transitions}
              current_nakshatra={activeDateData.nakshatra}
            />
          ) : (
            <CompactTransitionRowSkeleton />
          )}
        </div>

        <div className="col-span-2">
          {isLoading ? (
            <UpcomingEventsCardSkeleton />
          ) : (
            <UpcomingEventsCard events={upcomingEvents} />
          )}
        </div>
      </div>
    </div>
  );
}
