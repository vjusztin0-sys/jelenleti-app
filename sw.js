const C = 'vd1';
self.addEventListener('install', e => e.waitUntil(
  caches.open(C).then(c => c.addAll(['./', './index.html', './manifest.json', './icon.svg']))
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(n => {
      const cl = n.clone();
      caches.open(C).then(c => c.put(e.request, cl));
      return n;
    }).catch(() => caches.match(e.request))
  );
});
