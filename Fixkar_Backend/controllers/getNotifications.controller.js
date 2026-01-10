import { Notification } from "../models/notificationModel.js";

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