import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { GuruvaniFormValues } from "@/api/schemas/guruvani"
import { createGuruvani, deleteGuruvani, updateGuruvani } from "@/api/guruvani"
import { getAccessToken } from "@/hooks/useAuth"

function requireAccessToken() {
  const accessToken = getAccessToken()
  if (!accessToken) {
    throw new Error("You need to log in to do this")
  }
  return accessToken
}

export function useCreateGuruvani() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: GuruvaniFormValues) => createGuruvani(values, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guruvani"] })
    },
  })
}

export function useUpdateGuruvani() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: GuruvaniFormValues }) =>
      updateGuruvani(id, values, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guruvani"] })
    },
  })
}

export function useDeleteGuruvani() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteGuruvani(id, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guruvani"] })
    },
  })
}
