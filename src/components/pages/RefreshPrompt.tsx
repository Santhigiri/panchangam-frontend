import { useRegisterSW } from 'virtual:pwa-register/react';

export const RefreshPrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onNeedRefresh() {
      setNeedRefresh(true);
    },
    onOfflineReady() {
      console.log('Offline-ready');
    },
  });

  const reloadPage = () => {
    setNeedRefresh(false);
    updateServiceWorker(true); // Handles skipWaiting + reload
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
      <p className="text-sm text-gray-700">New update available!</p>
      <button
        onClick={reloadPage}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh
      </button>
    </div>
  );
};
