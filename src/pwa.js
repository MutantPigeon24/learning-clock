// Makes the app work offline and keeps it working after its web address is
// taken down (00-learning-clock.feature). The service worker is in sw.js.

/**
 * Asks the browser to keep the app's files even when the device is low on
 * space. Resolves true when they are kept. Never throws.
 */
export async function keepFilesStored(storage) {
  try {
    if (!storage?.persist) return false;
    if (await storage.persisted()) return true;
    return await storage.persist();
  } catch {
    return false;
  }
}

/**
 * Registers the service worker and asks to keep the files. Registering again
 * on each start is how a newer version is found. If the web address is gone,
 * the check fails quietly and the installed version keeps running.
 */
export function startOffline(nav = globalThis.navigator) {
  if (!nav?.serviceWorker) return;
  nav.serviceWorker
    .register('./sw.js', { scope: './', updateViaCache: 'none' })
    .catch(() => {});
  keepFilesStored(nav.storage);
}
