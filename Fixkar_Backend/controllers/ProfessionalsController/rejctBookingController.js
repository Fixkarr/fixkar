import { Booking } from "../../models/bookingModel.js"
import { Notification } from "../../models/notificationModel.js";
import { io } from "../../server.js";
import { pushNotification } from "../../services/pushNotification.js";

export const rejectBooking = async (req,res)=>{
    try {
        const {finalReason, bookingId}= req.body

        if(!finalReason){
            return res.status(400).json({
                message : "Reject statement is required!"
            })
        }

      const updatedBooking =   await Booking.findByIdAndUpdate(bookingId, {
            status : "rejected",
            rejectMessage : finalReason
        },{new : true}).populate({
    path: "customerId",
    populate: {
      path: "userId",
      model: "User",
      select: "fullName",
    },
  })
  .populate({
    path: "professionalId",
    select: "profilePicture address userId",
    populate: {
      path: "userId",
      model: "User",
      select: "fullName",
    },
  }).populate('review');
  
   if (!updatedBooking) { 
      return res.status(404).json({
        message: "Booking not found",
      });
    }

     const notification = await Notification.create({
      userId: updatedBooking.customerId.userId._id,
      title: "Booking Rejected",
      message: `Your booking has been rejected by ${updatedBooking.professionalId.userId.fullName}. Reason: ${finalReason}`,
      type: "booking_rejected",
      relatedId: updatedBooking._id,
      isRead: false,
    });

    
      const notificationPayload = {
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      redirectUrl: `/customer/bookings/${updatedBooking._id}`, // OPTIONAL
    };
    
      await pushNotification(notificationPayload);

    io.to(updatedBooking.customerId.userId._id.toString()).emit(
      "notification",
      {
        title: notification.title,
        message: notification.message,
        type: notification.type,
        relatedId: notification.relatedId,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      }
    );

     io.to(updatedBooking.customerId.userId._id.toString()).emit(
      "bookingUpdated",
      updatedBooking
    );

    io.to(updatedBooking.professionalId.userId._id.toString()).emit(
      "bookingUpdated",
      updatedBooking
    );

        return res.status(200).json({
            message : "Booking Rejected",
            booking: updatedBooking,
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message : "Internal server error"
        })
    }
}