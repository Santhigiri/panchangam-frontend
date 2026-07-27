import { useMemo } from "react";
import {
  useMasaReference,
  useNakshatraReference,
  useSanthigiriEvents,
  useThithiReference,
} from "@/hooks/usePanchangamReference";

export function useReferenceMaps() {
  const nakshatraReference = useNakshatraReference()
  const thithiReference = useThithiReference()
  const masaReference = useMasaReference()
  const eventsReference = useSanthigiriEvents()

  const isLoading =
    nakshatraReference.isLoading ||
    thithiReference.isLoading ||
    masaReference.isLoading ||
    eventsReference.isLoading

  const referenceMaps = useMemo(
    () => ({
      nakshatraByName: new Map((nakshatraReference.data ?? []).map((n) => [n.name, n])),
      thithiByName: new Map((thithiReference.data ?? []).map((t) => [t.name, t])),
      masaByName: new Map((masaReference.data ?? []).map((m) => [m.name, m])),
      eventById: new Map((eventsReference.data ?? []).map((e) => [e.id, e])),
    }),
    [nakshatraReference.data, thithiReference.data, masaReference.data, eventsReference.data]
  )

  return { referenceMaps, isLoading }
}
