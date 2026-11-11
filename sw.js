/* JiaBank service worker
 * - HTML: network-first (update langsung terlihat, tetap jalan saat offline)
 * - Aset statis & library Firebase: stale-while-revalidate
 * - Firestore, Auth, dan Gemini API tidak pernah di-cache
 */
const VERSION = 'jiabank-v3.0.1';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const NEVER_CACHE = /(firestore\.googleapis|identitytoolkit|securetoken|generativelanguage|googleapis\.com\/(?!css))/;

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (NEVER_CACHE.test(url.href)) return;

  // Halaman HTML: coba jaringan dulu
  if (req.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('.html'))) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Aset: tampilkan cache, perbarui di belakang
  const cacheable = url.origin === location.origin || /gstatic\.com|fonts\.googleapis\.com/.test(url.hostname);
  if (!cacheable) return;
  event.respondWith(
    caches.open(VERSION).then(cache =>
      cache.match(req).then(hit => {
        const net = fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()).catch(() => {});
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    )
  );
});
