// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize Firebase in service worker
firebase.initializeApp({
    apiKey: "AIzaSyCUSVTL51IRYG7KghGzVS7-NO2xdi0J1UY",
    authDomain: "skysift-a38f0.firebaseapp.com",
    projectId: "skysift-a38f0",
    storageBucket: "skysift-a38f0.firebasestorage.app",
    messagingSenderId: "720885363755",
    appId: "1:720885363755:web:30fcd10daa2cf155c1666e",
    measurementId: "G-BRTMV8Z730"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
    console.log('[Service Worker] Background message received:', payload);
    
    const notificationTitle = payload.notification?.title || 'Weather Alert';
    const notificationOptions = {
        body: payload.notification?.body || 'Check the weather app',
        icon: '/weather-icon.png',
        badge: '/badge-icon.png',
        tag: 'weather-notification',
        requireInteraction: true
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification clicked');
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});