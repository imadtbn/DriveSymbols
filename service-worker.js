const CACHE_NAME = 'drivesymbols-v8';
const BASE_PATH = new URL('./', self.location.href).pathname.replace(/\/$/, '');

const asset = path => `${BASE_PATH}${path}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/search.html',
  '/categories.html',
  '/brands.html',
  '/favorites.html',
  '/symbol.html',
  '/article.html',
  '/pages/about.html',
  '/pages/contact.html',
  '/pages/privacy.html',
  '/pages/terms.html',
  '/manifest.webmanifest',
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
  '/js/i18n.js',
  '/js/article.js',
  '/data/symbols.json',
  '/data/categories.json',
  '/data/brands.json',
  '/data/articles.json',
  '/css/articles.css',
  '/css/ads.css',
  '/js/site-tags.js',
  '/images/articles/engine-warning-cover.jpg',
  '/images/articles/oil-pressure-cover.jpg',
  '/images/articles/brakes-abs-cover.jpg',
  '/images/articles/tire-pressure-cover.jpg',
  '/images/articles/battery-cover.jpg',
  '/images/symbols/Temperature.webp',
  '/images/icons/icon-192x192.svg',
  '/images/icons/icon-512x512.svg'
].map(asset);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(name => name.startsWith('drivesymbols-') && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

const isAppRequest = request => {
  const url = new URL(request.url);
  return url.origin === self.location.origin && url.pathname.startsWith(`${BASE_PATH}/`);
};

const putInCache = (request, response) => {
  if (response && response.ok && response.type === 'basic') {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
  }
  return response;
};

const networkFirst = (request, options = {}) => {
  const networkRequest = options.noStore ? new Request(request, { cache: 'no-store' }) : request;
  return fetch(networkRequest)
    .then(response => putInCache(request, response))
    .catch(() => caches.match(request).then(cached =>
      cached || caches.match(asset('/index.html'))
    ));
};

const cacheFirst = request => caches.match(request)
  .then(cached => cached || fetch(request).then(response => putInCache(request, response)));

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !isAppRequest(event.request)) return;

  const pathname = new URL(event.request.url).pathname;
  const isDataOrCode = /\.(?:js|json|css)$/.test(pathname);
  event.respondWith(
    event.request.mode === 'navigate' || isDataOrCode
      ? networkFirst(event.request, { noStore: isDataOrCode })
      : cacheFirst(event.request)
  );
});
