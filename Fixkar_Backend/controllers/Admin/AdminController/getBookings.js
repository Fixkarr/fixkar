import { Booking } from "../../../models/bookingModel.js";

export const getBookings = async(req,res)=>{
    try {
        const admin = req.admin;
        if(!admin){
            return res.status(400).json({
                message : "Unauthorized!"
            })
        }

    const bookings = await Booking.find().populate({path : 'customerId', populate : {
            path : 'userId'
        }}).populate({
    path: "professionalId",
    populate: [{
      path: "userId",
      model: "User",
    },
  { path: "profession", populate: { path: "skills"} },
    {path : "selectedSkills"},
    {path : 'reviews'},
    {path : 'gallery'},
    {path : 'acceptedBy'},
],
  }).populate('currentPaymentId').populate('review');

    if(!bookings){
        return res.status(400).json({
            message : "Bookings Not Found"
        })
    }

    return res.status(200).json({
        message : "Mil gaye saare bookings",
        bookings
    })
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal server error!"})
    }
}