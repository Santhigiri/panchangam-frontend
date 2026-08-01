import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAppSettings, updateAppSetting } from "@/api/appSettings"

export function useAppSettings(enabled: boolean) {
  return useQuery({
    queryKey: ["app-settings"],
    queryFn: getAppSettings,
    enabled,
  })
}

export function useUpdateAppSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: Record<string, unknown> }) =>
      updateAppSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-settings"] })
    },
  })
}
