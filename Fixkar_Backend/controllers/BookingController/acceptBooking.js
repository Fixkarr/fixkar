import {Booking} from  '../../models/bookingModel.js'
import { io } from '../../server.js';
import { Notification } from '../../models/notificationModel.js';


export const acceptBooking = async (req,res)=>{
    try {
        const {bookingId} = req.body;
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

  if(!booking){
    return res.status(404).json({
        message : "Booking not found"
    })
  }

  booking.status = "accepted";
     await booking.save();

      await Notification.create({
      userId: booking.customerId.userId._id,
      title: "Booking Accepted",
      message: "Your booking has been accepted by the professional",
      type: "booking",
      relatedId: booking._id,
      isRead: false
    });
    
    io.to(booking.customerId.userId._id.toString()).emit(
      "notification",
      {
        title: "Booking Accepted",
        message: `Your booking has been accepted. Professional Name : ${booking.professionalId.userId.fullName}`,
        type: "booking",
        relatedId: booking._id,
        isRead: false
      }
    );

     await Notification.create({
      userId: booking.professionalId.userId._id,
      title: "Booking Accepted",
      message: `You accepted a booking successfully. Customer Name : ${booking.customerId.userId.fullName}`,
      type: "booking",
      relatedId: booking._id,
      isRead: false
    });

       io.to(booking.customerId.userId._id.toString()).emit(
             "bookingUpdated",
             booking
           );
     
           io.to(booking.professionalId.userId._id.toString()).emit(
             "bookingUpdated",
             booking
           );
     
  return res.status(200).json({
    success: true,
    message : "Booking accepted!",
    booking
  })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message : "Internal server error!"
        })
    }
}