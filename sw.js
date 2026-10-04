/**
 * sw.js — Service Worker del Misal Anglicano
 * Cachea el "shell" mínimo en la instalación; el resto de los recursos
 * (JS/CSS versionados con ?v=N, imágenes) se cachean dinámicamente en la
 * primera visita online y se sirven desde cache en visitas posteriores
 * (incluso sin conexión), sin depender de mantener una lista exhaustiva
 * de archivos con su número de versión exacto.
 */

const CACHE_NAME = 'misal-anglicano-v3';
const PRECACHE_URLS = [
  '/index.html',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Navegaciones y documentos HTML: red primero, cache solo como respaldo sin
  // conexión. Con cache-primero, tras un despliegue la primera visita servía el
  // index.html viejo (con los ?v= viejos) y los usuarios veían la página rota.
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
