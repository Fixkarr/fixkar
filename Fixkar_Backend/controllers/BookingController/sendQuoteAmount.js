import { Booking } from "../../models/bookingModel.js";
import {io} from '../../server.js'
export const sendQuoteAmount = async (req,res)=>{
    try {
        const {bookingId, quoteAmount} = req.body;
        if(!quoteAmount){
            return res.status(400).json({
                message : "Quote Amount is required!"
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
  }).populate('review');

  if(!booking){
    return res.status(404).json({
        message : "Booking not found!"
    })
  }

  if (booking.isPriceLocked) {
    return res.status(400).json({ message: "This booking has a locked upfront price" });
  }

    const myId = req.userId;
    if(myId !== booking.professionalId.userId._id.toString()){
        return res.status(400).json({
            message : "Unauthorized access!"
        })
    }

    booking.quoteAmount = quoteAmount;
    booking.quoteSentAt = new Date();
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
        message : "Quote amount sent!",
        booking
    })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message : "Internal server error"
        })
    }
}
