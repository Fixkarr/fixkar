importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCBsYjwK6rv1ow1Lbm70eHgBxelWg2UxIk",
  authDomain: "fixkar-dev.firebaseapp.com",
  projectId: "fixkar-dev",
  messagingSenderId: "229725846095",
  appId: "1:229725846095:web:65fc4a8495ec043835083a",
});

const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  // console.log("🔥 FCM BG MESSAGE", payload);

  const title = payload?.data?.title || "Notification";
  const body = payload?.data?.body || "";

  self.registration.showNotification(title, {
    body,
    icon: `https://fixkarr.com/favicon.png`,
    data: {
      redirectUrl: payload?.data?.redirectUrl || "/",
    },
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const redirectUrl = event.notification.data?.redirectUrl;

  if (redirectUrl) {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/") && "focus" in client) {
            client.navigate(redirectUrl);
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(redirectUrl);
        }
      })
    );
  }
});