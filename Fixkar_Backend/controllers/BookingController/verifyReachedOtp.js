import {Booking} from '../../models/bookingModel.js'
import {io} from '../../server.js'
import { ReachedOtp } from '../../models/reachedOtpModel.js';

export const verifyReachedOtp = async (req,res)=>{
    try {
        const {otp, bookingId} = req.body;
        if(!otp || !bookingId){
            return res.status(400).json({
                message : "OTP and bookingId are required!"
            })
        }

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
    select: "profilePicture address userId profession",
    populate: [{
      path: "userId",
      model: "User",
      select: "fullName",
    },
  { path: "profession", select: "name image skills", populate: { path: "skills", select: "name" } },
      {path : "selectedSkills", select : "name"}
],
  }).populate('review')

  if(!booking){
    return res.status(404).json({
        message : "Booking not found!"
    })
  }

  const myId = req.userId
  if(myId !== booking.professionalId.userId._id.toString()){
    return res.status(403).json({
        message : "Unauthorized Access"
    })
  }

  if (booking.status !== "reached") {
    return res.status(400).json({
      message: "OTP can only be verified after the professional is marked as reached"
    });
  }

  const otpRecord = await ReachedOtp.findOne({ bookingId }).select("otp attempts expiresAt");
  if(!otpRecord){
    return res.status(404).json({
        message : "OTP not found or expired!"
    })
  }

  if (otpRecord.expiresAt <= new Date()) {
    await ReachedOtp.deleteOne({ _id: otpRecord._id });
    return res.status(400).json({ message: "OTP expired!" });
  }

  if (otpRecord.attempts >= 5) {
    await ReachedOtp.deleteOne({ _id: otpRecord._id });
    return res.status(429).json({ message: "Too many invalid OTP attempts" });
  }

  const otpStr = otp.toString();

  if(otpRecord.otp !== otpStr){
    await ReachedOtp.updateOne(
      { _id: otpRecord._id },
      { $inc: { attempts: 1 } }
    );
    return res.status(400).json({
        message : "Invalid OTP!"
    })
  }

    booking.status = 'in-progress'
    booking.startedAt = Date.now()

    await booking.save();
    await ReachedOtp.deleteOne({ _id: otpRecord._id });

    io.to(booking.customerId.userId._id.toString()).emit(
            "bookingUpdated",
             booking
            );

    io.to(booking.customerId.userId._id.toString()).emit("bookingStatusUpdated", {
          bookingId,
          status: "in-progress"
        });

    io.to(booking.professionalId.userId._id.toString()).emit(
             "bookingUpdated",
             booking
            );

    return res.status(200).json({
        message : "verification success!",
        booking
    })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}