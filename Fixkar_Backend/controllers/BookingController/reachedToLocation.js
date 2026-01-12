import { Booking } from "../../models/bookingModel.js";
import { Notification } from "../../models/notificationModel.js";
import { ReachedOtp } from "../../models/reachedOtpModel.js";
import {io} from '../../server.js'
import bcrypt from "bcryptjs";
import { pushNotification } from "../../services/pushNotification.js";
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
    select: "profilePicture address userId",
    populate: {
      path: "userId",
      model: "User",
      select: "fullName",
    },
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const isExistOtp = await ReachedOtp.findOne({ bookingId: booking._id });

    if (isExistOtp) {
      return res.status(400).json({ message: "OTP already generated for this booking" });
    }

     await ReachedOtp.create({
      bookingId: booking._id,
      otp,
    })

    booking.status = "reached";
    booking.startedAt = Date.now()

    await booking.save();

    
    await Notification.create({
      userId: booking.customerId.userId._id,
      title: "Professional Reached Location",
      message: `Professional ${booking.professionalId.userId.fullName} has reached your location. OTP : ${otp}`,
      type: "booking_reached",
      relatedId: booking._id,
      isRead: false,
    });

    
      const notificationPayload = {
      userId: booking.customerId.userId._id,
      title: "Professional Reached Location",
      message: `Professional ${booking.professionalId.userId.fullName} has reached your location. OTP : ${otp}`,
      redirectUrl: `/customer/bookings/${booking._id}`, // OPTIONAL
    };
    
      await pushNotification(notificationPayload);

    io.to(booking.customerId.userId._id.toString()).emit(
      "notification",
      {
        title: "Professional Reached Location",
        message: `Professional ${booking.professionalId.userId.fullName} has reached your location. OTP : ${otp}`,
        type: "booking_reached",
        relatedId: booking._id,
        isRead: false,
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