importScripts("https://unpkg.com/workbox-sw@1.1.0");
var cache_name = "rutas-cache-v8";
var urlsToCache = ["/", "/index.html", "/javascript/index.bundle.js"];

self.addEventListener("install", function(event) {
  // Perform install steps
  event.waitUntil(fetch("/documents.json").
    then(documents => documents.json()).
    then((jsonDocuments) => jsonDocuments.map(document => document.image)).
    then((imagesArray) => { 
      caches.open(cache_name).then(function(cache) {
      return cache.addAll(urlsToCache.concat(imagesArray));})
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(keyList => { 
      Promise.all(
        keyList.map(key => {
          if (key !== cache_name) {
            console.log("deleting old cache");
            return caches.delete(key);
          }
        })
      );
    })
  );
});