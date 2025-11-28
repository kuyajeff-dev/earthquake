const STATIC_CACHE = 'jepoy-static-v1';
const urlsToCache = [
  '/earthquake/',       // root of your PWA
  '/earthquake/index.html',
  '/earthquake/manifest.json',
  '/earthquake/LOGO.jpg' // include your logo if referenced
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.warn('Cache install failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => { 
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE) return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // Optional: fallback if offline
        if (event.request.destination === 'document') {
          return caches.match('/earthquake/index.html');
        }
      })
  );
});
