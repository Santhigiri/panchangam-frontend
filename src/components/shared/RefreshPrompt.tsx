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
      // navigation) rarely runs on its own. Relying on a timer alone means an
      // update can sit unnoticed for up to the poll interval — and the timer
      // only ticks while the app is open. So we check at the moments the user
      // actually comes back to the app, and keep a short poll as a backstop.
      if (!registration) return

      const checkForUpdate = () => {
        // Only meaningful when we're online; update() hits the network.
        if (navigator.onLine) registration.update()
      }

      // Fires the instant a resumed PWA / backgrounded tab becomes visible.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate()
      })
      // Desktop window focus, and reconnecting after being offline.
      window.addEventListener('focus', checkForUpdate)
      window.addEventListener('online', checkForUpdate)

      // Backstop for a long-lived, continuously-visible session.
      setInterval(checkForUpdate, 15 * 60 * 1000) // every 15 min
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
    <Card className="fixed top-16 right-4 md:top-auto md:bottom-10 shadow-lg z-40">
      <CardContent className="p-3 flex items-center gap-3">
        <p className="text-sm whitespace-nowrap">Update available</p>
        <Button size="xs" onClick={reloadPage}>
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};
