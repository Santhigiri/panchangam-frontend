import { useEffect, useState } from "react"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { MapPinIcon } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { loadGoogleMaps } from "@/lib/googleMapsLoader"
import { getTimezoneForLocation } from "@/features/starfinder/api/timezone"

export type ResolvedLocation = {
  label: string
  latitude: number
  longitude: number
  timezone: string
}

type LocationSearchFieldProps = {
  id?: string
  onLocationChange: (location: ResolvedLocation | null) => void
}

export default function LocationSearchField({ id, onLocationChange }: LocationSearchFieldProps) {
  const [mapsReady, setMapsReady] = useState(false)
  const [mapsError, setMapsError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [resolveError, setResolveError] = useState<string | null>(null)

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({ debounce: 300, initOnMount: false })

  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        init()
        setMapsReady(true)
      })
      .catch((error: unknown) => {
        setMapsError(error instanceof Error ? error.message : "Failed to load Google Maps")
      })
  }, [init])

  function handleInputChange(nextValue: string) {
    setValue(nextValue)
    setResolveError(null)
    onLocationChange(null)
    setOpen(nextValue.trim().length > 0)
  }

  async function handleSelect(placeId: string, description: string) {
    setValue(description, false)
    clearSuggestions()
    setOpen(false)
    setResolveError(null)
    setIsResolving(true)
    onLocationChange(null)

    try {
      const results = await getGeocode({ placeId })
      const { lat, lng } = getLatLng(results[0])
      const timezone = await getTimezoneForLocation(lat, lng)
      onLocationChange({ label: description, latitude: lat, longitude: lng, timezone })
    } catch (error) {
      setResolveError(error instanceof Error ? error.message : "Failed to resolve location")
      onLocationChange(null)
    } finally {
      setIsResolving(false)
    }
  }

  const disabled = !mapsReady || !ready

  return (
    <div className="flex flex-col gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false} className="overflow-visible bg-transparent">
          <PopoverAnchor asChild>
            <CommandInput
              id={id}
              value={value}
              onValueChange={handleInputChange}
              disabled={disabled}
              placeholder={mapsError ? "Location search unavailable" : "Search for a place…"}
              className="h-9 rounded-md border border-input bg-transparent shadow-xs"
            />
          </PopoverAnchor>
          <PopoverContent
            className="w-(--radix-popover-trigger-width) p-0"
            align="start"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <CommandList>
              {status === "OK" && data.length === 0 && (
                <CommandEmpty>No matching places.</CommandEmpty>
              )}
              {data.map((suggestion) => (
                <CommandItem
                  key={suggestion.place_id}
                  value={suggestion.place_id}
                  onSelect={() => handleSelect(suggestion.place_id, suggestion.description)}
                >
                  <MapPinIcon className="text-muted-foreground" />
                  {suggestion.description}
                </CommandItem>
              ))}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>

      {mapsError ? (
        <p className="text-xs text-destructive">{mapsError}</p>
      ) : isResolving ? (
        <p className="text-xs text-muted-foreground">Resolving location…</p>
      ) : resolveError ? (
        <p className="text-xs text-destructive">{resolveError}</p>
      ) : null}
    </div>
  )
}
