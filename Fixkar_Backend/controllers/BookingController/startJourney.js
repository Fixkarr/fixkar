import { Booking } from "../../models/bookingModel.js";
import { Notification } from "../../models/notificationModel.js";
import { io } from "../../server.js";
import { pushNotification } from "../../services/pushNotification.js";

export const startJourney = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const professionalUserId = req.userId;

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
        select: "profilePicture address userId profession shortCode",
        populate: [{
          path: "userId",
          model: "User",
          select: "fullName",
        },
      { path: "profession", select: "name image skills", populate: { path: "skills", select: "name" } },
          {path : "selectedSkills", select : "name"}
    ],
      }).populate('review');

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      booking.professionalId.userId._id.toString() !==
      professionalUserId.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized action",
      });
    }

    if (booking.status === "on-the-way") {
      return res.status(400).json({
        success: false,
        message: "Journey has already been started",
      });
    }

    if (booking.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Journey cannot be started at this stage",
      });
    }

    booking.status = "on-the-way";
    booking.journeyStartedAt = new Date();

    await booking.save();

    const notification = await Notification.create({
      userId: booking.customerId.userId._id,
      title: "Professional is on the way",
      message: `${booking.professionalId.userId.fullName} has started the journey to your location.`,
      type: "booking_on_the_way",
      relatedId: booking._id,
      isRead: false,
    });

    const notificationPayload = {
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      redirectUrl: `/customer/bookings/${booking._id}`,
    };

    await pushNotification(notificationPayload);

    io.to(booking.customerId.userId._id.toString()).emit(
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

    return res.status(200).json({
      success: true,
      message: "Journey started successfully",
      booking,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};