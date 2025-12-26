import { Booking } from "../../models/bookingModel.js";

export const getBookingById = async (req,res)=>{
    try {
        const {bookingId} = req.params;

        if(!bookingId){
            return res.status(400).json({
                message : "Booking id is required"
            })
        }

        const booking = await Booking.findById(bookingId).populate({
      path : "customerId",
      populate : {
        path : "userId",
        model : "User",
        select : "fullName"
      }
    }).populate({
      path : "professionalId",
      select : 'profilePicture address',
      populate : {
        path : "userId",
        model : "User",
        select : "fullName"
      }
    }).populate('review')

    if(!booking){
        return res.status(400).json({
            message : "Booking not found!"
        })
    }

    res.status(200).json({
        booking
    })


    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message : "Internal server error!"
        })
    }
}