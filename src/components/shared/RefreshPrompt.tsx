import { useRegisterSW } from 'virtual:pwa-register/react';

export const RefreshPrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onNeedRefresh() {
      setNeedRefresh(true);
      console.log("Refresh needed!");
    },
    onOfflineReady() {
      console.log('Offline-ready');
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
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
        updateServiceWorker(true); // Skip waiting + reload
      });
    }
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-[#E4E4CC] p-4 rounded-lg shadow-lg border">
      <p className="text-sm text-gray-700">New update available!</p>
      <button
        onClick={reloadPage}
        className="mt-2 p-2 text-[#E4E4CC] text-xs bg-[#8F4E00] rounded hover:opacity-70"
      >
        Refresh
      </button>
    </div>
  );
};
