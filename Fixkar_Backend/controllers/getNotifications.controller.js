import { Notification } from "../models/notificationModel.js";
import { User } from "../models/userModel.js";

export const getNotifications = async (req,res)=>{
    try {
        const myId = req.userId;
        const notifications = await Notification.find({userId: myId}).sort({createdAt : -1})
        const unreadCount = await Notification.countDocuments({userId: myId, isRead: false});

           return res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });

    } catch (error) {
        console.log("get notification error", error)
         return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
    }
}

export const saveFCMToken = async (req,res)=>{
    try {
        const userId = req.userId;
        const {fcmToken} = req.body;

        if (!fcmToken) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required",
      });
    }

    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
        success: false,
        message: "User not found",
    })
    }

    if (user.fcmTokens.includes(fcmToken)) {
      return res.status(200).json({
        success: true,
        message: "FCM token already saved",
      });
    }

    user.fcmTokens.push(fcmToken);
    await user.save();

      return res.status(200).json({
      success: true,
      message: "FCM token saved successfully",
    });

    } catch (error) {
      console.log("save FCM token error", error);
          return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    }
}