import { getToken } from 'firebase/messaging'
import { messaging } from '../firebase.js'
import axios from 'axios'
import { server_url } from '../App';
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";



let androidRegistrationPromise = null;

const saveFCMToken = async (token) => {
  if (!token) return null;

  try {
    await axios.post(
      `${server_url}/api/notification/save-fcm-token`,
      { fcmToken: token },
      { withCredentials: true }
    );

    return token;
  } catch (error) {
    console.warn(
      "Could not save FCM token:",
      error?.response?.data?.message || error?.message
    );

    return null;
  }
};

const registerAndroidFCM = async () => {
  // Prevent duplicate registration/listeners
  if (androidRegistrationPromise) {
    return androidRegistrationPromise;
  }

  androidRegistrationPromise = new Promise(async (resolve, reject) => {
    try {
      let permission = await PushNotifications.checkPermissions();
      console.log("🔔 Android notification permission:", permission);
      if (permission.receive === "prompt") {
        permission = await PushNotifications.requestPermissions();
      }
        console.log(
    "🔔 Android notification permission after request:",
    permission
  );

    console.log(
  "🔔 Final notification permission:",
  permission.receive
);
      if (permission.receive !== "granted") {
        console.warn("Android notification permission denied");
        resolve(null);
        return;
      }
       await PushNotifications.createChannel({
  id: "fixkar_notifications",
  name: "Fixkar Notifications",
  description: "Notifications from Fixkar",
  importance: 5,
  sound: "default",
  vibration: true,
});

      const registrationListener =
        await PushNotifications.addListener(
          "registration",
          async (token) => {
            console.log("Android FCM token received");

            const savedToken = await saveFCMToken(token.value);

            resolve(savedToken);

            await registrationListener.remove();
          }
        );

   

      await PushNotifications.register();
    } catch (error) {
      console.error(
        "Android FCM registration failed:",
        error
      );

      androidRegistrationPromise = null;
      reject(error);
    }
  });

  return androidRegistrationPromise;
};




export const generateFCMToken = async () => {
    try {

         if (Capacitor.getPlatform() === "android") {
      return await registerAndroidFCM();
    }

         if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return null;
    }

    let serviceWorkerRegistration;

    if ("serviceWorker" in navigator) {
      serviceWorkerRegistration =
        await navigator.serviceWorker.ready;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      serviceWorkerRegistration,
    });

    return await saveFCMToken(token);
  } catch (error) {
    console.warn("FCM initialization skipped:", error?.message);
    return null;
  }
};

