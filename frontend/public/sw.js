// Minimal service worker: makes Bitlink installable as a PWA.
// It deliberately does no caching, so the dashboard is always fresh.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
