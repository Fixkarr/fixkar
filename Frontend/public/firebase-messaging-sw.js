importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fixkar-62c40.firebaseapp.com",
  projectId: "fixkar-62c40",
  messagingSenderId: "797851996951",
  appId: "1:797851996951:web:b4f30d322684ed82191d52",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/favicon.png",   // same logo jo tum in-app me use karte ho
    }
  );
});