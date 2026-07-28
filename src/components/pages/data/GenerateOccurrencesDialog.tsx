import { useEffect, useState } from "react"
import { format } from "date-fns"
import type { SanthigiriEvent } from "@/api/schemas/santhigiriEvent"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGenerateSanthigiriEventOccurrences } from "@/hooks/useSanthigiriEventMutations"
import { CALENDAR_END_DATE, CALENDAR_START_DATE } from "@/lib/constants"

const YEAR_OPTIONS = Array.from(
  { length: CALENDAR_END_DATE.getFullYear() - CALENDAR_START_DATE.getFullYear() + 1 },
  (_, i) => CALENDAR_START_DATE.getFullYear() + i
)

const MAX_YEAR_SPAN = 15

type GenerateOccurrencesDialogProps = {
  event: SanthigiriEvent | null
  onOpenChange: (open: boolean) => void
}

export function GenerateOccurrencesDialog({
  event,
  onOpenChange,
}: GenerateOccurrencesDialogProps) {
  const [startYear, setStartYear] = useState(() => new Date().getFullYear())
  const [endYear, setEndYear] = useState(() => new Date().getFullYear())
  const generateMutation = useGenerateSanthigiriEventOccurrences()

  const { reset: resetGenerateMutation } = generateMutation
  useEffect(() => {
    if (event) {
      const currentYear = new Date().getFullYear()
      setStartYear(currentYear)
      setEndYear(currentYear)
      resetGenerateMutation()
    }
  }, [event, resetGenerateMutation])

  const rangeInvalid = endYear < startYear
  const rangeTooLarge = !rangeInvalid && endYear - startYear + 1 > MAX_YEAR_SPAN

  return (
    <Dialog open={event !== null} onOpenChange={(next) => !next && onOpenChange(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate occurrences</DialogTitle>
          <DialogDescription>
            Recompute {event?.name}&rsquo;s occurrence dates for a range of years from the
            stored panchangam data. This replaces any dates already generated for those years.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          <Field className="flex-1">
            <FieldLabel htmlFor="occurrences-start-year">Start year</FieldLabel>
            <Select
              value={String(startYear)}
              onValueChange={(value) => setStartYear(Number(value))}
            >
              <SelectTrigger id="occurrences-start-year" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field className="flex-1">
            <FieldLabel htmlFor="occurrences-end-year">End year</FieldLabel>
            <Select value={String(endYear)} onValueChange={(value) => setEndYear(Number(value))}>
              <SelectTrigger id="occurrences-end-year" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        {rangeInvalid && (
          <FieldError>End year must be on or after start year.</FieldError>
        )}
        {rangeTooLarge && (
          <FieldError>Year range too large (max {MAX_YEAR_SPAN} years).</FieldError>
        )}

        {generateMutation.isSuccess && (
          <div className="max-h-64 overflow-y-auto text-sm text-foreground">
            {Object.entries(generateMutation.data.occurrences).map(([year, dates]) => (
              <div key={year} className="mb-2">
                <p className="mb-1 font-medium">
                  {year}: {dates.length === 0 ? "no occurrences" : `${dates.length} occurrence(s)`}
                </p>
                {dates.length > 0 && (
                  <ul className="list-inside list-disc text-muted-foreground">
                    {dates.map((date) => (
                      <li key={date}>{format(new Date(date), "d MMMM yyyy")}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {generateMutation.isError && (
          <FieldError>
            {generateMutation.error instanceof Error
              ? generateMutation.error.message
              : "Failed to generate occurrences."}
          </FieldError>
        )}

        <DialogFooter>
          <Button
            disabled={!event || generateMutation.isPending || rangeInvalid || rangeTooLarge}
            onClick={() => {
              if (event) generateMutation.mutate({ eventId: event.id, startYear, endYear })
            }}
          >
            {generateMutation.isPending ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
