// Service worker: stores every file on install and serves them from the
// device, so the app works offline and keeps working after its web address is
// taken down (00-learning-clock.feature).
//
// FILES lists everything the app loads. A test checks it against what
// index.html, the manifest, the CSS and the JS imports actually use.
// BUILD is a fingerprint of those files. A test fails if it is out of date;
// run `npm run stamp` to update it. Changing BUILD changes this file, which is
// how the browser notices a new version.

const BUILD = 'b94295258d93';
const CACHE_PREFIX = 'learning-clock-';
const CACHE = CACHE_PREFIX + BUILD;
const START_PAGE = './index.html';

const FILES = [
  './index.html',
  './manifest.webmanifest',
  './styles.css',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './src/app.js',
  './src/clock-face.js',
  './src/clock-view.js',
  './src/colours.js',
  './src/grown-up-check.js',
  './src/grown-up-panel.js',
  './src/layout.js',
  './src/look-art.js',
  './src/look-choice.js',
  './src/look-picker.js',
  './src/panel.js',
  './src/pwa.js',
  './src/scene-art.js',
  './src/set-clock.js',
  './src/settings.js',
  './src/storage.js',
  './src/time.js',
];

// Store every file. `cache: 'reload'` skips the browser's own HTTP cache, so a
// new version never stores an old copy of a file. If any file fails, install
// fails and the version already installed stays in use.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FILES.map((url) => new Request(url, { cache: 'reload' })))),
  );
  // No skipWaiting(): a new version takes over the next time the app opens,
  // so nothing changes while a child is using it.
});

// Remove older versions' files once this version is in charge.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Serve from the device first. Only go to the network for something not
// stored, and never store what comes back, so an error page can't replace a
// good file. Every page in the app opens the start page.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(respond(request));
});

async function respond(request) {
  const key = request.mode === 'navigate' ? START_PAGE : request;
  let stored;
  try {
    stored = await (await caches.open(CACHE)).match(key, { ignoreSearch: true });
  } catch {
    // Storage is broken: carry on with the network rather than fail.
  }
  return stored || fetch(request);
}
