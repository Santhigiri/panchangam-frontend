import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { GuruvaniFormValues } from "@/features/guruvani/schemas/guruvani"
import { createGuruvani, deleteGuruvani, updateGuruvani } from "@/features/guruvani/api/guruvani"

export function useCreateGuruvani() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: GuruvaniFormValues) => createGuruvani(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guruvani"] })
    },
  })
}

export function useUpdateGuruvani() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: GuruvaniFormValues }) =>
      updateGuruvani(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guruvani"] })
    },
  })
}

export function useDeleteGuruvani() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteGuruvani(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guruvani"] })
    },
  })
}
