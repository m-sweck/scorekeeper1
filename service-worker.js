const CACHE_NAME = 'scorekeeper-v1'; // Cache version
const urlsToCache = [
    '/', // Cache the root path
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'icons/icon-192x192.png', // Make sure your icon paths are correct
    'icons/icon-512x512.png'
    // Add any other assets (images, fonts) you want to cache here
];

// Install event: caching app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // Activates the new service worker immediately
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Makes the service worker control all clients immediately
    );
});

// Fetch event: serve from cache first, then network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request);
            })
    );
});
