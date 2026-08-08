import { Booking } from "../../models/bookingModel.js";
import { Professional } from "../../models/userModel.js";
import { Skill } from "../../models/skillsModel.js";
import { Notification } from "../../models/notificationModel.js";
import { Customer } from "../../models/userModel.js";
import {io} from '../../server.js'
import { pushNotification } from "../../services/pushNotification.js";
import { sendWhatsAppMessage } from "../../utils/sendWhatsaAppMessage.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import { Service } from "../../models/serviceModel.js";
import { findEligibleProfessionals } from "../../services/matchingEngine.js";
import { calculateDistanceForProfessionals } from "../../services/calculateDistanceForProfessionals.js";
import { handlePickupBooking } from "../../services/handlePickupBooking.js";
export const sendHireRequest = async (req, res)=>{
    try {
        const {professionalId, workDate, workTime, mobileNumber, problemDescription, workAddress, distanceInKm,  customerLat,
    customerLng, customerName, taskId} = req.body;

    console.log(customerLng, customerLat, "CUSTOMER LOCATION")
        const dateMatch = /^\d{4}-\d{2}-\d{2}$/.test(workDate || "");
        const timeMatch = /^([01]\d|2[0-3]):[0-5]\d$/.test(workTime || "");

        if (!dateMatch || !timeMatch) {
          return res.status(400).json({ message: "Please provide a valid service date and time" });
        }



        const [year, month, day] = workDate.split("-").map(Number);
        const calendarDate = new Date(Date.UTC(year, month - 1, day));
        const isValidCalendarDate =
          calendarDate.getUTCFullYear() === year &&
          calendarDate.getUTCMonth() === month - 1 &&
          calendarDate.getUTCDate() === day;

        // Service time is entered in the app's India-facing local time (IST).
        const scheduledAt = new Date(`${workDate}T${workTime}:00+05:30`);
        if (!isValidCalendarDate || Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
          return res.status(400).json({
            message: "Please select a future date and time for the service request",
          });
        }

        const myId = req.userId;
        const customerId = await Customer.findOne({userId : myId}).select('_id');
        const isDirectHire = !!professionalId;
     let professional = null;

     if(!isDirectHire){
              if (
    customerLat == null ||
    customerLng == null
){
    return res.status(400).json({
        message:"Customer location is required."
    });
}
     }



if (isDirectHire) {
  professional = await Professional.findById(professionalId)
    .populate({
      path: "profession",
      select: "serviceType",
    });

  if (!professional || !professional.profession) {
    return res.status(404).json({
      message: "Professional not found",
    });
  }
}

        // Pricing is always calculated on the server.  Never trust a visit or
        // task price supplied by the browser.
        let task = null;
        let pricingType = "inspection";
        let serviceCharge = null;
        let totalAmount = null;
        let isPriceLocked = false;
        let service = null;

if (isDirectHire) {
  service = professional.profession;
} else {
 service = await Service.findOne({
    skills: taskId,
}).select("name serviceType");
}
        if (taskId) {
        task = await Skill.findById(taskId);

if (!task || !task.isActive) {
    return res.status(400).json({
        message:"Invalid task"
    });
}

if(task.service.toString()!==service._id.toString()){
    return res.status(400).json({
        message:"Task doesn't belong to this service"
    })
}
        if(isDirectHire){
          if (!professional.selectedSkills.some((id) => id.toString() === task._id.toString())) {
            return res.status(400).json({ message: "This professional does not offer the selected task" });
          }
        }
          if (task.bookingType === "fixed") {
            pricingType = "fixed";
            if (task.pricingSource === "admin") {
              serviceCharge = Number(task.fixedPrice);
            } else if(isDirectHire){
              const professionalRate = professional.taskPricing.find(
                (rate) => rate.skill.toString() === task._id.toString()
              );
              if (!professionalRate) {
                return res.status(400).json({ message: "Professional has not set a price for this task" });
              }
              serviceCharge = Number(professionalRate.price);
            }
            if (!Number.isFinite(serviceCharge) || serviceCharge < 0) {
              return res.status(400).json({ message: "Task price is not available" });
            }
          if (isDirectHire) {

            const calculateVisitingCharge = (distanceInKm) => {
            
                const baseCharge = Number(distanceInKm);
                if(baseCharge <= 10){
                    return 25
                }
                return Math.round(baseCharge + (baseCharge - 5) * 3);
            }

    const visitingCharge =
        professional.visitingCharge ??
        calculateVisitingCharge(distanceInKm);

    totalAmount =
        Number(visitingCharge) +
        serviceCharge;

}
            isPriceLocked = true;
          }
        }

        let audioMessages = [];
         if (req.files && req.files.length > 0) {
      for (let file of req.files) {

        if (!file.mimetype.startsWith("audio/")) {
          return res.status(400).json({
            message: "Only audio files allowed for voice description",
          });
        }

        const uploadResult = await uploadToCloudinary(
          file,
          "booking_audio_messages"
        );

        audioMessages.push({
          url: uploadResult.secure_url,
        });
      }
    }
      let visitingCharge = null;

      if (isDirectHire) {
          visitingCharge =
              professional.visitingCharge ??
              calculateVisitingCharge(distanceInKm);
      }

     
        const newBooking = new Booking({
            customerId ,
            customerName,
            professionalId: isDirectHire
                          ? professionalId
                          : null, 
            workDate,
            workTime,
            problemDescription,
            visitingCharge,
            workAddress,
            distanceInKm,
            mobileNumber,
            audioMessages, 
            service: isDirectHire
                      ? professional.profession._id
                      : task.service,
            task: task?._id,
            pricingType,
            serviceCharge,
            totalAmount,
            isPriceLocked,
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
      select: "fullName mobile",
    },
  { path: "profession", select: "name image skills", populate: { path: "skills", select: "name" } },
      {path : "selectedSkills", select : "name"}
],
  }).populate('review');

if(isDirectHire){
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


    const message = await sendWhatsAppMessage({
  phone: booking.professionalId.userId.mobile,
  customerName: booking.customerName,
  address : booking.workAddress,
  bookingId: booking._id.toString(),
});

    console.log(message)

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

}else{
    return await handlePickupBooking({
        req,
        res,
        customerId,
        customerName,
        mobileNumber,
        workDate,
        workTime,
        workAddress,
        problemDescription,
        task,
        service,
        customerLat,
        customerLng,
        audioMessages,

    });
}

      


    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message : "Internal server error, please try again",
        })
    }
}
