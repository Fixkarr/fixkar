import { getToken } from 'firebase/messaging'
import { messaging } from '../firebase.js'
import axios from 'axios'
import { server_url } from '../App';

export const generateFCMToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return null;

        let serviceWorkerRegistration;
        if ('serviceWorker' in navigator) {
            serviceWorkerRegistration = await navigator.serviceWorker.ready;
        }

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
            serviceWorkerRegistration,
        });

        if (token) {
            try {
                await axios.post(
                    `${server_url}/api/notification/save-fcm-token`,
                    { fcmToken: token },
                    { withCredentials: true }
                );
            } catch (error) {
                console.warn('Could not save FCM token', error?.message);
            }
        }

        return token || null;
    } catch (error) {
        console.warn('FCM initialization skipped:', error?.message);
        return null;
    }
};
