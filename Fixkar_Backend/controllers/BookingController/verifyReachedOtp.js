import {Booking} from '../../models/bookingModel.js'
import bcrypt from 'bcryptjs';
import {io} from '../../server.js'
import { ReachedOtp } from '../../models/reachedOtpModel.js';

export const verifyReachedOtp = async (req,res)=>{
    try {
        const {otp, bookingId} = req.body;
        if(!otp){
            return res.status(404).json({
                message : "OTP required!"
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
    return res.status(400).json({
        message : "Unathorized Access"
    })
  }

  const otpStr = otp.toString();

  const isOtpExists = await ReachedOtp.findOne({ bookingId });
  if(!isOtpExists){
    return res.status(404).json({
        message : "OTP not found!"
    })
  }

 if(isOtpExists.otp !== otpStr){
    return res.status(400).json({
        message : "Invalid OTP!"
    })
  }

    booking.status = 'in-progress'
    booking.startedAt = Date.now()

    await booking.save();

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