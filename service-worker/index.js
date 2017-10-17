self.addEventListener('fetch', function(event) {
  let url = new URL(event.request.url);

  let request = event.request;

  if (request.headers.has('x-use-cache')) {
    event.respondWith(caches.open('v2').then(function(cache) {
      return cache.match(request);
    }));
  } else if (url.pathname.match(/\/repos/)) {
    event.respondWith(caches.open('v2').then(function(cache) {
      cache.add(request);
      return fetch(request);
    }));
  }
});
