import { Booking } from "../../models/bookingModel.js";
import { Notification } from "../../models/notificationModel.js";
import {io} from '../../server.js'
export const cancelCustomerBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;

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

        if (!booking) {
            return res.status(404).json({
                message: "Booking not Found"
            })
        }

        if (booking.status === "in-progress" || booking.status === "rejected" || booking.status === "completed") {
            return res.status(400).json({
                message: "Booking cannot be cancelled!"
            })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const workDate = new Date(booking.workDate);
        workDate.setHours(0, 0, 0, 0);

        if (workDate > today) {
            booking.status = "cancelled";
            await booking.save();

             await Notification.create({
        userId: booking.professionalId.userId._id,
        title: "Booking Cancelled",
        message: `Customer has cancelled the booking. Customer Name : ${booking.customerId.userId.fullName}`,
        type: "booking",
        relatedId: booking._id,
        isRead: false,
      });

          await Notification.create({
        userId: booking.customerId.userId._id,
        title: "Booking Cancelled",
        message: `Your booking has been cancelled successfully. Professional Name : ${booking.professionalId.userId.fullName}`,
        type: "booking",
        relatedId: booking._id,
        isRead: false,
      });

          io.to(booking.professionalId.userId._id.toString()).emit(
        "notification",
        {
          title: "Booking Cancelled",
            message: `Customer has cancelled the booking. Customer Name : ${booking.customerId.userId.fullName}`,
          type: "booking",
          relatedId: booking._id,
          isRead: false,
        }
      );

      io.to(booking.customerId.userId._id.toString()).emit(
        "notification",
        {
          title: "Booking Cancelled",
          message: `Your booking has been cancelled successfully. Professional Name : ${booking.professionalId.userId.fullName}`,
          type: "booking",
          relatedId: booking._id,
          isRead: false,
        }
      );


              io.to(booking.customerId.userId._id.toString()).emit(
        "bookingUpdated",
        booking
      );

      io.to(booking.professionalId.userId._id.toString()).emit(
        "bookingUpdated",
        booking
      );

            return res.json({
                success: true,
                type: "FREE_CANCEL",
                message:
                    "Booking has been cancelled successfully without any cancellation charges.",
            });
        }

            return res.json({
            success: false,
            type: "PAYMENT_REQUIRED",
            message:
                "Late cancellation detected. Visiting charge and ₹50 cancellation fee are applicable.",
            charges: {
                visitingCharge: booking.visitingCharge,
                cancellationFee: 50,
                total: booking.visitingCharge + 50,
            },
    });

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message : "Internal server error!"
        })
    }
}