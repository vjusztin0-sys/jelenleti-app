const C = 'vd2';
self.addEventListener('install', e => e.waitUntil(
  caches.open(C).then(c => c.addAll(['./', './index.html', './manifest.json', './icon.svg']))
));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return; // Supabase/CDN kérések ne menjenek a cache-be
  e.respondWith(
    fetch(e.request).then(n => {
      const cl = n.clone();
      caches.open(C).then(c => c.put(e.request, cl));
      return n;
    }).catch(() => caches.match(e.request))
  );
});
