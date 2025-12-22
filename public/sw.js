/// <reference lib="webworker" />

const CACHE_NAME = 'hustly-v1';
const STATIC_CACHE = 'hustly-static-v1';
const DYNAMIC_CACHE = 'hustly-dynamic-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/habits',
    '/goals',
    '/achievements',
    '/analytics',
    '/challenges',
    '/chat',
    '/finance',
    '/vision',
    '/ideas',
    '/leaderboard',
    '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-http(s) requests (chrome-extension, etc.)
    if (!request.url.startsWith('http')) {
        return;
    }

    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API calls, Supabase requests, and Next.js internals
    if (url.pathname.startsWith('/api/') ||
        url.pathname.startsWith('/_next/') ||
        url.hostname.includes('supabase')) {
        return;
    }

    // For navigation requests, try network first
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone and cache the response
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        try {
                            cache.put(request, responseClone);
                        } catch (e) {
                            console.log('[SW] Cache put failed:', e);
                        }
                    }).catch(() => { });
                    return response;
                })
                .catch(() => {
                    // Fallback to cache
                    return caches.match(request).then((cachedResponse) => {
                        return cachedResponse || caches.match('/');
                    });
                })
        );
        return;
    }

    // For other requests, try cache first, then network
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached response and update cache in background
                fetch(request).then((response) => {
                    if (response.ok) {
                        caches.open(DYNAMIC_CACHE).then((cache) => {
                            try {
                                cache.put(request, response);
                            } catch (e) {
                                console.log('[SW] Cache put failed:', e);
                            }
                        }).catch(() => { });
                    }
                }).catch(() => { });
                return cachedResponse;
            }

            // Not in cache, fetch from network
            return fetch(request).then((response) => {
                // Cache successful responses
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        try {
                            cache.put(request, responseClone);
                        } catch (e) {
                            console.log('[SW] Cache put failed:', e);
                        }
                    }).catch(() => { });
                }
                return response;
            }).catch(() => {
                // Return offline fallback if available
                return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
            });
        })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || 'New notification from Hustly',
        icon: '/icons/icon-192x192.svg',
        badge: '/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
            timestamp: Date.now(),
        },
        actions: [
            { action: 'open', title: 'Open' },
            { action: 'dismiss', title: 'Dismiss' },
        ],
        tag: data.tag || 'hustly-notification',
        renotify: true,
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Hustly', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'dismiss') return;

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            // If app is already open, focus it
            const existingClient = clients.find((client) => {
                return client.url.includes(self.location.origin);
            });

            if (existingClient) {
                existingClient.focus();
                existingClient.navigate(url);
                return;
            }

            // Open new window
            return self.clients.openWindow(url);
        })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-habits') {
        event.waitUntil(syncHabits());
    }
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncTransactions());
    }
});

async function syncHabits() {
    // Get pending habit completions from IndexedDB and sync
    console.log('[SW] Syncing habits...');
    // Implementation would retrieve from IndexedDB and POST to Supabase
}

async function syncTransactions() {
    // Get pending transactions from IndexedDB and sync
    console.log('[SW] Syncing transactions...');
    // Implementation would retrieve from IndexedDB and POST to Supabase
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'morning-briefing') {
        event.waitUntil(sendMorningBriefing());
    }
});

async function sendMorningBriefing() {
    // Check time and send morning briefing notification
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 6 && hour <= 9) {
        return self.registration.showNotification('☀️ Good Morning, Hustler!', {
            body: 'Time to check your habits and start the day strong!',
            icon: '/icons/icon-192x192.svg',
            badge: '/favicon.svg',
            tag: 'morning-briefing',
            data: { url: '/habits' },
        });
    }
}

console.log('[SW] Service Worker loaded');
