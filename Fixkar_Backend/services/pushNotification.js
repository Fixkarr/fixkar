import { User } from "../models/userModel.js";

export const pushNotification = async ({
    userId, title, message, redirectUrl
})=>{
     if (!tokens || !tokens.length) return;

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