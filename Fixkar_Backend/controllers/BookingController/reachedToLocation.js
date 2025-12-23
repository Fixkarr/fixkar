import { Booking } from "../../models/bookingModel.js";
import {io} from '../../server.js'
import bcrypt from "bcryptjs";
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
  });

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
    const hashedOTP = await bcrypt.hash(otp, 10);

    booking.status = "reached";
    booking.reachedOTP = hashedOTP
    booking.reachedAt = new Date();
    await booking.save();


    const safeBooking = booking.toObject();
    delete safeBooking.reachedOTP;

    io.to(booking.customerId.userId._id.toString()).emit(
      "bookingUpdated",
      safeBooking
    );

    io.to(booking.professionalId.userId._id.toString()).emit(
      "bookingUpdated",
      safeBooking
    );

     io.to(booking.customerId.userId._id.toString()).emit(
      "reachedOTP",
      {
        bookingId: booking._id,
        otp,
        message: "Please share this OTP with the professional",
      }
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