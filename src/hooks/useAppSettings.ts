import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { APP_SETTINGS_CACHE_KEY, getAppSettings, updateAppSetting } from "@/api/appSettings"
import { clearEtagCache } from "@/api/etagCache"

const APP_SETTINGS_QUERY_KEY = ["app-settings"]

export function useAppSettings(enabled: boolean) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: APP_SETTINGS_QUERY_KEY,
    queryFn: () =>
      getAppSettings((data) => queryClient.setQueryData(APP_SETTINGS_QUERY_KEY, data)),
    enabled,
    // The list is ETag-validated (see fetchWithEtag): resolves instantly
    // from the cached value and revalidates in the background, so there's
    // no benefit to holding onto "fresh" data between refetches.
    staleTime: 0,
  })
}

export function useUpdateAppSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: Record<string, unknown> }) =>
      updateAppSetting(key, value),
    onSuccess: async () => {
      // Drop the cached ETag entry so the refetch below does a normal fetch
      // instead of instantly resolving the now-stale cached list.
      await clearEtagCache(APP_SETTINGS_CACHE_KEY)
      await queryClient.invalidateQueries({ queryKey: APP_SETTINGS_QUERY_KEY })
    },
  })
}
