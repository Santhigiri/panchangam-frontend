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
  });

  const reloadPage = () => {
    setNeedRefresh(false);
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName.startsWith('workbox-') || cacheName.startsWith('cache-')) {
            caches.delete(cacheName);
          }
        });
        updateServiceWorker(true);
      });
    }
  };

  if (!needRefresh) return null;

  return (
    <Card className="fixed bottom-10 right-4 shadow-lg w-48">
      <CardContent className="pt-4 flex flex-col gap-2">
        <p className="text-sm">New update available!</p>
        <Button size="sm" onClick={reloadPage} className="bg-[#8F4E00] hover:opacity-70">
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};
