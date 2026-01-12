import { User } from "../models/userModel.js";
import admin from '../config/firebaseAdmin.js'
export const pushNotification = async ({
    userId, title, message, redirectUrl
}) => {

    const user = await User.findById(userId).select('fcmTokens');
    if (!user || !user.fcmTokens.length) return;



   const payload = {
  data: {
    redirectUrl: redirectUrl || "",
  },
  webpush: {
    notification: {
      title: title,
      body: message,
      icon: `https:/fixkar.netlify.app/favicon.png`,
      data: {
        redirectUrl: redirectUrl || "",
      },
    },
    fcmOptions: {
      link: redirectUrl || "/",   // 🔥 IMPORTANT
    },
  },
  tokens: user.fcmTokens,
};


    const response = await admin.messaging().sendEachForMulticast(payload);
    // console.log("🔥 FCM RESPONSE:", JSON.stringify(response, null, 2));
    return response
}