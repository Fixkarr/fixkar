import { Booking } from "../../models/bookingModel.js";
import { Notification } from "../../models/notificationModel.js";
import { Payment } from "../../models/paymentModel.js";
import { io } from '../../server.js'
import { pushNotification } from "../../services/pushNotification.js";
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
        select: "profilePicture address userId profession",
        populate: [{
          path: "userId",
          model: "User",
          select: "fullName",
        },
        { path: "profession", select: "name image skills", populate: { path: "skills", select: "name" } },
        { path: "selectedSkills", select: "name" }
        ],
      }).populate('review');

    if (!booking) {
      return res.status(404).json({
        message: "Booking not Found"
      })
    }

    if (booking.customerId.userId._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "You can only cancel your own booking." });
    }

    if (["cancelled", "in-progress", "rejected", "completed"].includes(booking.status)) {
      return res.status(400).json({
        message: "Booking cannot be cancelled!"
      })
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workDate = new Date(booking.workDate);
    workDate.setHours(0, 0, 0, 0);

    if (workDate > today || booking.status === "pending") {
      booking.status = "cancelled";
      booking.cancellationType = "free";
      await booking.save();

      const notification = await Notification.create({
        userId: booking.professionalId.userId._id,
        title: "Booking Cancelled",
        message: `Customer has cancelled the booking. Customer Name : ${booking.customerName}`,
        type: "booking_cancelled",
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

    const payment = await Payment.findOne({ bookingId: booking._id });
    console.log(payment);
    if(payment && payment.paymentType === "CANCEL" && payment.status === "paid"){
      return res.json({
        success : true,
        type : "Payment Done!",
        message : "Booking has been cancelled!"
      })
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
      message: "Internal server error!"
    })
  }
}
