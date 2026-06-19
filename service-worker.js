const CACHE_NAME = 'rutas-andes-cache-v1';

// 1. EVENTO DE INSTALACIÓN
// Aquí podemos definir archivos básicos que queremos guardar desde el primer segundo.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caché abierto');
      return cache.addAll([
        '/',
        '/images/favicon-32x32.png',
        '/images/favicon-16x16.png'
      ]);
    })
  );
  // Fuerza al Service Worker a activarse inmediatamente
  self.skipWaiting();
});

// 2. EVENTO DE ACTIVACIÓN
// Sirve para borrar cachés antiguos cuando actualices la versión (ej. de v1 a v2)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpiando caché antiguo', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. EVENTO FETCH (El núcleo del modo Offline)
// Intercepta las peticiones de red (cuando el usuario navega a un artículo)
self.addEventListener('fetch', (event) => {
  // Solo interceptamos peticiones "GET" (lectura), ignoramos envíos de formularios, etc.
  if (event.request.method !== 'GET') return;

  event.respondWith(
    // Intenta buscar el contenido en la web (Network First)
    fetch(event.request)
      .then((response) => {
        // Si la web responde correctamente, guardamos una copia en el celular
        // Clonamos la respuesta porque solo se puede leer una vez
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // Si falla (estamos OFFLINE en la montaña), buscamos en la caché del celular
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Opcional: Aquí podrías devolver una página de "Sin conexión" si la tienes
          // return caches.match('/offline.html');
        });
      })
  );
});