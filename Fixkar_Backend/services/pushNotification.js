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
      icon: `https://fixkarr.com/favicon.png`,
      data: {
        redirectUrl: redirectUrl || "",
      },
    },
    fcmOptions: {
      link: redirectUrl || "/",   // 🔥 IMPORTANT
    },
  },
  android: {
  notification: {
    title,
    body: message,
    channelId: "fixkar_notifications",
    icon: "ic_stat_fixkar",
  },
},
  tokens: user.fcmTokens,
};


    const response = await admin.messaging().sendEachForMulticast(payload);
    // console.log("🔥 FCM RESPONSE:", JSON.stringify(response, null, 2));
    return response
}