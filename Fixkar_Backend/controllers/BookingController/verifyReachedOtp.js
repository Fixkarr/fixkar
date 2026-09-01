import {Booking} from '../../models/bookingModel.js'
import {io} from '../../server.js'

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

  const otpRecord = booking.reachedOTP;
  if(!otpRecord){
    return res.status(404).json({
        message : "OTP not found or expired!"
    })
  }


  const otpStr = otp.toString();

  if(otpRecord !== otpStr){
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

    io.to(booking.professionalId.userId._id.toString()).emit(
             "bookingUpdated",
             booking
            );

    return res.status(200).json({
        message : "verification success!",
        booking
    })

    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}