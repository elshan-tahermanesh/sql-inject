const CACHE_NAME = 'sqli-edu-sandbox-v11';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght=400;500;600;700&display=swap',
  'https://img.icons8.com/nolan/192/security-shield.png',
  'https://img.icons8.com/nolan/512/security-shield.png'
];

// SW Install Event - Pre-cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA Service Worker: Pre-caching standard static assets.');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// SW Activate Event - Clean up stale cache databases
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('PWA Service Worker: Deleting outdated static cache cache store:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// SW Fetch Event - Network first, fall back to cache strategy
self.addEventListener('fetch', (event) => {
  // Navigation request fallback (routing pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/') || caches.match('/offline.html');
      })
    );
    return;
  }

  // Network first, fall back to cache strategy
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If network returns a valid file, add/update it in cache
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed, serve from cache if available
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback image resource if image loading fails
          if (event.request.destination === 'image') {
            return caches.match('https://img.icons8.com/nolan/192/security-shield.png');
          }
        });
      })
  );
});
