import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import StarfinderResultPanel from "./StarfinderResultPanel"
import StarfinderResultPanelSkeleton from "./StarfinderResultPanelSkeleton"
import StarfinderTransitionsTabs from "./StarfinderTransitionsTabs"
import StarfinderTransitionsTabsSkeleton from "./StarfinderTransitionsTabsSkeleton"
import type { FormEvent } from "react"
import type { StarfinderParams } from "@/hooks/useStarfinder"
import TopAppBar from "@/components/shared/TopAppBar"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useReferenceMaps } from "@/hooks/homepage/useReferenceMaps"
import { Button } from "@/components/ui/button"
import { useStarfinder } from "@/hooks/useStarfinder"
import { enrichPanchangamDay } from "@/lib/enrichPanchangamData"
import { APP_TIMEZONE, CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants"

export default function StarfinderPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState("12:00")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [submitted, setSubmitted] = useState<StarfinderParams | null>(null)

  const { referenceMaps, isLoading: isReferenceLoading } = useReferenceMaps()
  const query = useStarfinder(submitted)

  const lat = Number(latitude)
  const lon = Number(longitude)
  const isValid =
    timeOfDay.length > 0 &&
    latitude.trim().length > 0 &&
    longitude.trim().length > 0 &&
    !Number.isNaN(lat) && lat >= -90 && lat <= 90 &&
    !Number.isNaN(lon) && lon >= -180 && lon <= 180

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValid) return
    setSubmitted({ day: date, timeOfDay, latitude: lat, longitude: lon, timezone: APP_TIMEZONE })
  }

  const enriched = submitted && query.data && !isReferenceLoading
    ? enrichPanchangamDay(query.data, referenceMaps)
    : undefined

  return (
    <div className="flex flex-col items-stretch gap-4">
      <TopAppBar title="Starfinder" />

      <form onSubmit={handleSubmit} className="px-2">
        <Card className="rounded-md py-4">
          <CardContent className="px-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="starfinder-date">Date</FieldLabel>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="starfinder-date"
                      type="button"
                      variant="outline"
                      className="justify-start"
                    >
                      <CalendarIcon />
                      {date.toLocaleDateString("default", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={date}
                      defaultMonth={date}
                      startMonth={CALENDAR_START_DATE}
                      endMonth={CALENDAR_END_DATE}
                      disabled={(day) =>
                        day < CALENDAR_START_DATE || day > CALENDAR_END_DATE
                      }
                      onSelect={(selected) => {
                        if (selected) {
                          setDate(selected)
                          setDatePickerOpen(false)
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              <Field>
                <FieldLabel htmlFor="starfinder-time">Time</FieldLabel>
                <Input
                  id="starfinder-time"
                  type="time"
                  value={timeOfDay}
                  onChange={(event) => setTimeOfDay(event.target.value)}
                  required
                />
              </Field>

              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="starfinder-latitude">Latitude</FieldLabel>
                  <Input
                    id="starfinder-latitude"
                    type="number"
                    step="any"
                    min={-90}
                    max={90}
                    placeholder="-90 to 90"
                    value={latitude}
                    onChange={(event) => setLatitude(event.target.value)}
                    required
                  />
                </FieldContent>
                <FieldContent>
                  <FieldLabel htmlFor="starfinder-longitude">Longitude</FieldLabel>
                  <Input
                    id="starfinder-longitude"
                    type="number"
                    step="any"
                    min={-180}
                    max={180}
                    placeholder="-180 to 180"
                    value={longitude}
                    onChange={(event) => setLongitude(event.target.value)}
                    required
                  />
                </FieldContent>
              </Field>

              <Button type="submit" disabled={!isValid || query.isFetching}>
                {query.isFetching ? "Finding…" : "Find"}
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>
      </form>

      {submitted && (
        <div className="flex flex-col gap-3 px-2">
          {query.isError ? (
            <p className="text-center text-sm text-destructive">
              {query.error instanceof Error ? query.error.message : "Something went wrong."}
            </p>
          ) : enriched ? (
            <>
              <StarfinderResultPanel
                queriedDate={submitted.day}
                timeOfDay={submitted.timeOfDay}
                kv={enriched.kv}
                nakshatra={enriched.nakshatra}
                thithi={enriched.thithi}
                sunrise={enriched.sunrise}
                sunset={enriched.sunset}
                timeZone={submitted.timezone}
              />
              <StarfinderTransitionsTabs
                thithiTransitions={enriched.thithi_transitions}
                currentThithi={enriched.thithi}
                nakshatraTransitions={enriched.nakshatra_transitions}
                currentNakshatra={enriched.nakshatra}
              />
            </>
          ) : (
            <>
              <StarfinderResultPanelSkeleton />
              <StarfinderTransitionsTabsSkeleton />
            </>
          )}
        </div>
      )}
    </div>
  )
}
