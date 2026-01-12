importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA6UvlFZtuNIR_ciOc_JoiGSGLZtbeqins",
  authDomain: "fixkar-62c40.firebaseapp.com",
  projectId: "fixkar-62c40",
  messagingSenderId: "797851996951",
  appId: "1:797851996951:web:b4f30d322684ed82191d52",
});

const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  // console.log("🔥 FCM BG MESSAGE", payload);

  const title = payload?.data?.title || "Notification";
  const body = payload?.data?.body || "";

  self.registration.showNotification(title, {
    body,
    icon: `https://fixkar.netlify.app/favicon.png`,
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