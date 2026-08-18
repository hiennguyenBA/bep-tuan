// Bump this on every deploy so clients pick up the new version and drop old caches.
const CACHE_NAME = 'chip-kitchen-v29';
const APP_SHELL = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // {cache:'reload'} bypasses the browser's own HTTP cache for each shell
      // file. Without it, a page loaded minutes ago can still have index.html
      // sitting in the HTTP cache, and cache.addAll() would silently bake that
      // stale copy into the *new* CACHE_NAME -- the update badge/reload fires,
      // but the content served is still old.
      return Promise.all(APP_SHELL.map((url) =>
        fetch(url, { cache: 'reload' }).then((res) => cache.put(url, res))
      ));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
