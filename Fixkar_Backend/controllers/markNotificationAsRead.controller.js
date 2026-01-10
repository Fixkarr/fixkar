import { Notification } from "../models/notificationModel.js";

export const markAllNotificationsRead = async (req,res)=>{
    try {
        const userId = req.userId

         await Notification.updateMany(
      { userId: userId, isRead: false },
      { $set: { isRead: true } }
    );

      return res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });

    } catch (error) {
         return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
    }
}