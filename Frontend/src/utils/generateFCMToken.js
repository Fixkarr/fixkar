import {getToken} from 'firebase/messaging'
import { messaging } from '../firebase.js'
import axios from 'axios'
import { server_url } from '../App';
export const generateFCMToken = async () => {
    const permission = await Notification.requestPermission();
    if(permission !== 'granted'){
        return null;
    }

    const token = await getToken(messaging, {
        vapidKey : import.meta.env.VITE_VAPID_PUBLIC_KEY
    });

    if(token){
        try{
           await axios.post(`${server_url}/api/notification/save-fcm-token`, {fcmToken : token}, {withCredentials : true});
        }catch{

        }
    }
}