import { useRegisterSW } from 'virtual:pwa-register/react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const RefreshPrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onNeedRefresh() { setNeedRefresh(true) },
    onOfflineReady() {},
    onRegisterError(error) { console.error('SW registration error:', error) },
    onRegisteredSW(_url, registration) {
      // An installed/standalone PWA is usually resumed rather than freshly
      // navigated, so the browser's own update check (which fires on
      // navigation) rarely runs on its own — poll for updates explicitly.
      if (!registration) return
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000) // hourly
    },
  });

  const reloadPage = () => {
    setNeedRefresh(false);
    // Hand off to the waiting service worker (skipWaiting) and reload. The new
    // SW repopulates the precache on activation and Workbox drops outdated
    // precache entries itself — so we must NOT delete the workbox precache here.
    // Doing so wiped the offline app shell and left the next offline open
    // failing with ERR_FAILED.
    updateServiceWorker(true);
  };

  if (!needRefresh) return null;

  return (
    <Card className="fixed bottom-10 right-4 shadow-lg w-48">
      <CardContent className="pt-4 flex flex-col gap-2">
        <p className="text-sm">New update available!</p>
        <Button size="sm" onClick={reloadPage}>
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};
