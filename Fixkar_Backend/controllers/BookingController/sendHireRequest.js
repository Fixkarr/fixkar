import { Booking } from "../../models/bookingModel.js";
import { Notification } from "../../models/notificationModel.js";
import { Customer } from "../../models/userModel.js";
import {io} from '../../server.js'
import { pushNotification } from "../../services/pushNotification.js";
export const sendHireRequest = async (req, res)=>{
    try {
        const {professionalId, workDate, workTime, mobileNumber, problemDescription, visitingCharge, workAddress, distanceInKm, customerName} = req.body;

        const myId = req.userId;
        const customerId = await Customer.findOne({userId : myId}).select('_id');
     
        const newBooking = new Booking({
            customerId ,
            customerName,
            professionalId, 
            workDate,
            workTime,
            problemDescription,
            visitingCharge,
            workAddress,
            distanceInKm,
            mobileNumber
        })

        const savedBooking = await newBooking.save()
    const booking = await Booking.findById(savedBooking._id)
  .populate({
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

   const notification = await Notification.create({
      userId: booking.professionalId.userId._id,
      title: "New Booking Request",
      message: `New hire request received from ${booking.customerName}`,
      type: "booking_pending",
      relatedId: booking._id,
      isRead: false,
    });

    
      const notificationPayload = {
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      redirectUrl: `/professional/bookings/${booking._id}`, // OPTIONAL
    };
    
      await pushNotification(notificationPayload);

    io.to(booking.professionalId.userId._id.toString()).emit(
      "notification",
      {
        title: notification.title,
        message: notification.message,
        type: notification.type,
        relatedId: notification.relatedId,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      }
    );




       io.to(booking.professionalId.userId._id.toString()).emit(
      "newBookingRequest",
      booking
    );

    io.to(booking.customerId.userId._id.toString()).emit(
      "bookingCreated",
      booking
    );


        res.status(200).json({
            success : true,
            message : "Hire request sent successfully",
            booking
        })


    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message : "Internal server error, please try again",
        })
    }
}