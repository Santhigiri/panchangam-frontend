import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  SanthigiriEventFormValues,
  SanthigiriEventGenerateProgress,
} from "@/api/schemas/santhigiriEvent"
import {
  createSanthigiriEvent,
  deleteSanthigiriEvent,
  generateSanthigiriEventOccurrences,
  updateSanthigiriEvent,
} from "@/api/santhigiriEvents"
import { getAccessToken } from "@/hooks/useAuth"
import { queryClient } from "@/lib/query-client"

function requireAccessToken() {
  const accessToken = getAccessToken()
  if (!accessToken) {
    throw new Error("You need to log in to do this")
  }
  return accessToken
}

export function useCreateSanthigiriEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: SanthigiriEventFormValues) =>
      createSanthigiriEvent(values, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["santhigiri-events"] })
    },
  })
}

export function useUpdateSanthigiriEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      eventId,
      values,
    }: {
      eventId: string
      values: Omit<SanthigiriEventFormValues, "id">
    }) => updateSanthigiriEvent(eventId, values, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["santhigiri-events"] })
    },
  })
}

export function useGenerateSanthigiriEventOccurrences(
  onProgress?: (progress: SanthigiriEventGenerateProgress) => void
) {
  return useMutation({
    mutationFn: ({
      eventId,
      startYear,
      endYear,
    }: {
      eventId: string
      startYear: number
      endYear: number
    }) =>
      generateSanthigiriEventOccurrences(
        eventId,
        startYear,
        endYear,
        requireAccessToken(),
        onProgress
      ),
  })
}

export function useDeleteSanthigiriEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventId: string) =>
      deleteSanthigiriEvent(eventId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["santhigiri-events"] })
    },
  })
}
