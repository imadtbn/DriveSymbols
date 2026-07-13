const CACHE_NAME = 'drivesymbols-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/search.html',
  '/categories.html',
  '/symbol.html',
  '/about.html',
  '/contact.html',
  '/css/variables.css',
  '/css/main.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/search.js',
  '/js/ui.js',
  '/js/share.js',
  '/js/favorites.js',
  '/js/filters.js',
  '/data/symbols.json',
  '/data/categories.json',
  '/data/brands.json'
];

// Install - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - cache first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          });
      })
  );
});