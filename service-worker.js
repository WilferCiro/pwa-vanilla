const CACHE_NAME = "my-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/effect.css",
  "/js/main.js",
  "/js/effect.js",
  "/service-worker.js",
  "/images/android-chrome-192x192.png",
];

self.addEventListener("install", function (event) {
  console.log("Service Worker instalado");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  // self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  if (self.clients && clients.claim) {
    clients.claim();
  }
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener("push", function (event) {
  const options = {
    body: event.data.text(),
    icon: "/images/android-chrome-512x512.png",
    badge: "/images/badge-128x128.png",
  };

  event.waitUntil(
    self.registration.showNotification("Título de la Notificación", options)
  );
});
