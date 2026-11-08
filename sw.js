/* SECOND BRAIN OS — resilient PWA cache V1.0.1 */
const CACHE = 'second-brain-os-v2.0-free-ai';
const CORE = ['./', './index.html', './styles.css', './app.js', './local-ai.js', './db.js', './sync.js', './firebase-config.js', './manifest.webmanifest'];
const OPTIONAL = ['./icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Cache each resource independently: one missing icon/file must not block SW installation.
    await Promise.allSettled([...CORE, ...OPTIONAL].map(async path => {
      const response = await fetch(path, { cache: 'reload' });
      if (!response.ok) throw new Error(`Cannot cache ${path}: ${response.status}`);
      await cache.put(path, response);
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('second-brain-os-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const shell = await caches.match('./index.html');
        if (shell) return shell;
      }
      throw error;
    }
  })());
});
