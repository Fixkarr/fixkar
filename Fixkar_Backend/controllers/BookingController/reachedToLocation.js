import { Booking } from "../../models/bookingModel.js";
import { Notification } from "../../models/notificationModel.js";
import {io} from '../../server.js'
import { pushNotification } from '../../services/pushNotification.js';
import { generateOtpPlain } from "../../utils/otpHelper.js";
export const reachedToLocation = async (req, res)=>{
    try{
    const {bookingId} = req.body;
    const professionalUserId = req.userId;

    const booking = await Booking.findById(bookingId).populate({
    path: "customerId",
    populate: {
      path: "userId",
      model: "User",
      select: "fullName",
    },
  })
  .populate({
    path: "professionalId",
    select: "profilePicture address userId profession shortCode",
    populate: [{
      path: "userId",
      model: "User",
      select: "fullName",
    },
  { path: "profession", select: "name image skills", populate: { path: "skills", select: "name" } },
      {path : "selectedSkills", select : "name"}
],
  }).populate('review');

   if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

   if (
      booking.professionalId.userId._id.toString() !== professionalUserId
    ) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    if (!["accepted"].includes(booking.status)) {
      return res.status(400).json({
        message: "Booking cannot be marked as reached at this stage"
      });
    }

    const otp = generateOtpPlain(6);

    const isExistOtp = booking.reachedOTP;

    if (isExistOtp) {
      return res.status(400).json({ message: "OTP already generated for this booking" });
    }

    
    booking.reachedOTP = otp;
    booking.reachedAt = new Date();
    booking.status = "reached";
    await booking.save();

    const notification = await Notification.create({
      userId: booking.customerId.userId._id,
      title: "Professional Reached to your Location",
      message: `${booking.professionalId.userId.fullName} has reached your location. Reached OTP is ${otp}`,
      type: "booking_reached",
      relatedId: booking._id,
      isRead: false,
    });

    
      const notificationPayload = {
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      redirectUrl: `/customer/bookings/${booking._id}`,
    };
    
      await pushNotification(notificationPayload);

    io.to(booking.customerId.userId._id.toString()).emit(
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

    io.to(booking.customerId.userId._id.toString()).emit(
      "bookingUpdated",
      booking
    );

    io.to(booking.professionalId.userId._id.toString()).emit(
      "bookingUpdated",
      booking
    );

    res.status(200).json({
      success: true,
      message: "Marked as reached successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
