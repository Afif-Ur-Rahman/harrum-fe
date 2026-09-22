/** Harrum Cloth House - PWA Service Worker */
const CACHE_NAME = "harrum-v1";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => {
        return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", event => {
  // Only cache GET requests, let API calls pass through
  if (event.request.method !== "GET") return;

  // Don't cache Next.js HMR and API routes
  if (event.request.url.includes("/api/") || event.request.url.includes("_next/webpack")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful page/assets responses
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => cached || caches.match("/"));
      }),
  );
});
