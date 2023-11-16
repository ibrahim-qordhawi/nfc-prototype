import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);
// Add event listeners
self.addEventListener("install", (event) => {
  console.log("install:");
  // Do something when the service worker is installed
});
self.addEventListener("activate", (event) => {
  console.log("activate:");
  // Do something when the service worker is activated
});

self.addEventListener("fetch", (event) => {
  // Do something when a resource is fetched
  console.log("fetch:");
});
self.addEventListener("push", (event) => {
  // Do something when a push notification is rf
  console.log("push:");
});
