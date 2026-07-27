import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { SanthigiriEventFormValues } from "@/api/schemas/santhigiriEvent"
import {
  createSanthigiriEvent,
  deleteSanthigiriEvent,
  updateSanthigiriEvent,
} from "@/api/santhigiriEvents"
import { getAccessToken } from "@/hooks/useAuth"

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
