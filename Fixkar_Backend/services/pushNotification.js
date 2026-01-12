import { User } from "../models/userModel.js";
import admin from '../config/firebaseAdmin.js'

export const pushNotification = async ({
    userId, title, message, redirectUrl
})=>{

     const user = await User.findById(userId).select('fcmTokens');
        if(!user || !user.fcmTokens.length) return;


     
const payload = {
    notification: { title, body : message },
    data : {
        redirectUrl : redirectUrl || '',

    },
    tokens : user.fcmTokens,
  };
 
  return await admin.messaging().sendEachForMulticast(payload);

}