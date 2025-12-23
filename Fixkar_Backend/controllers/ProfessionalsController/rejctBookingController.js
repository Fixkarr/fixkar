import { Booking } from "../../models/bookingModel.js"
import { io } from "../../server.js";

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
  });
   if (!updatedBooking) { 
      return res.status(404).json({
        message: "Booking not found",
      });
    }

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