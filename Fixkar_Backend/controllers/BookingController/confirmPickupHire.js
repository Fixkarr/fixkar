import { Booking } from "../../models/bookingModel.js";
import { Notification } from "../../models/notificationModel.js";
import { PickupRequest } from "../../models/pickup.model.js";
import { PickupSession } from "../../models/pickupSession.model.js";
import { Customer } from "../../models/userModel.js";
import { io } from "../../server.js";
import { pushNotification } from "../../services/pushNotification.js";

const populateBooking = (query) => query
  .populate({
    path: "customerId",
    populate: { path: "userId", model: "User", select: "fullName mobile" },
  })
  .populate({
    path: "professionalId",
    select: "profilePicture address userId profession selectedSkills",
    populate: [
      { path: "userId", model: "User", select: "fullName mobile" },
      { path: "profession", select: "name image skills commission" },
      { path: "selectedSkills", select: "name" },
    ],
  })
  .populate("service", "name")
  .populate("task", "name");

// Customer selects an already-accepted pickup request. The professional has
// effectively accepted at this point, so the standard lifecycle starts at
// `accepted` (reached -> in-progress -> payment) with the displayed amount locked.
export const confirmPickupHire = async (req, res) => {
  try {
    const { pickupRequestId } = req.body;
    if (!pickupRequestId) {
      return res.status(400).json({ success: false, message: "Pickup request ID is required." });
    }

    const customer = await Customer.findOne({ userId: req.userId }).select("_id userId");
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found." });
    }

    const pickupRequest = await PickupRequest.findOne({
      _id: pickupRequestId,
      customerId: customer._id,
      status: "accepted",
    });
    if (!pickupRequest) {
      return res.status(404).json({ success: false, message: "This accepted pickup request is no longer available." });
    }

    const now = new Date();
    const pickupSession = await PickupSession.findById(pickupRequest.pickupSessionId);
    if (!pickupSession || pickupSession.customerId.toString() !== customer._id.toString()) {
      return res.status(404).json({ success: false, message: "Pickup session not found." });
    }

    // A retry after a successful tap returns the one booking instead of creating a duplicate.
    if (pickupSession.bookingId) {
      const booking = await populateBooking(Booking.findById(pickupSession.bookingId));
      return res.status(200).json({ success: true, message: "Booking already confirmed.", booking });
    }

    if (pickupSession.status !== "selecting" ||
        !pickupSession.customerSelectionExpiresAt ||
        pickupSession.customerSelectionExpiresAt <= now) {
      return res.status(400).json({ success: false, message: "The confirmation window has expired." });
    }

    const charge = pickupRequest.charge || {};
    const totalAmount = Number(charge.totalAmount);
    const serviceCharge = Number(charge.taskPrice);
    const visitingCharge = Number(charge.visitingCharge);
    const professionalReceivable = Number(charge.professionalAmount);
    if (![totalAmount, serviceCharge, visitingCharge, professionalReceivable].every(Number.isFinite)) {
      return res.status(400).json({ success: false, message: "Pickup price details are invalid." });
    }

    // Reserve the session before creating the booking so concurrent taps cannot select two professionals.
    const reservedSession = await PickupSession.findOneAndUpdate(
      {
        _id: pickupSession._id,
        status: "selecting",
        bookingId: null,
        customerSelectionExpiresAt: { $gt: now },
      },
      {
        $set: {
          status: "confirmed",
          selectedProfessionalId: pickupRequest.professionalId,
          selectedPickupRequestId: pickupRequest._id,
        },
      },
      { new: true }
    );
    if (!reservedSession) {
      return res.status(409).json({ success: false, message: "Another professional has already been selected." });
    }

    const booking = await Booking.create({
      customerId: customer._id,
      customerName: pickupRequest.customerName,
      professionalId: pickupRequest.professionalId,
      workDate: new Date(pickupRequest.workDate).toISOString().slice(0, 10),
      workTime: pickupRequest.workTime,
      problemDescription: pickupRequest.problemDescription || "Pickup booking",
      audioMessages: pickupRequest.audioMessages,
      visitingCharge,
      workAddress: pickupRequest.workAddress,
      distanceInKm: pickupRequest.distanceInKm,
      mobileNumber: String(pickupRequest.customerMobileNumber),
      service: pickupRequest.serviceId,
      task: pickupRequest.taskId,
      pricingType: "fixed",
      serviceCharge,
      totalAmount,
      professionalReceivable,
      isPriceLocked: true,
      status: "accepted",
      assignmentStatus: "assigned",
    });

    await Promise.all([
      PickupSession.findByIdAndUpdate(reservedSession._id, { bookingId: booking._id }),
      PickupRequest.findByIdAndUpdate(pickupRequest._id, { bookingId: booking._id, customerSelectedAt: now }),
      PickupRequest.updateMany(
        { pickupSessionId: reservedSession._id, _id: { $ne: pickupRequest._id }, status: { $in: ["pending", "accepted"] } },
        { $set: { status: "cancelled", cancelledByCustomer: true } }
      ),
    ]);

    const populatedBooking = await populateBooking(Booking.findById(booking._id));
    const customerUserId = populatedBooking.customerId.userId._id;
    const professionalUserId = populatedBooking.professionalId.userId._id;
    const notifications = await Notification.create([
      {
        userId: customerUserId,
        title: "Booking Confirmed",
        message: `Your booking with ${populatedBooking.professionalId.userId.fullName} is confirmed. Payable amount: ₹${totalAmount}.`,
        type: "booking_accepted", relatedId: booking._id, isRead: false,
      },
      {
        userId: professionalUserId,
        title: "Booking Confirmed",
        message: `Booking confirmed with ${populatedBooking.customerName}. You will receive ₹${professionalReceivable}.`,
        type: "booking_accepted", relatedId: booking._id, isRead: false,
      },
    ]);

    await Promise.all(notifications.map((notification) => pushNotification({
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      redirectUrl: notification.userId.toString() === customerUserId.toString()
        ? `/customer/bookings/${booking._id}`
        : `/professional/bookings/${booking._id}`,
    })));

    for (const notification of notifications) {
      io.to(notification.userId.toString()).emit("notification", notification.toObject());
    }
    io.to(customerUserId.toString()).emit("bookingCreated", populatedBooking);
    io.to(professionalUserId.toString()).emit("newBookingRequest", populatedBooking);
    io.to(customerUserId.toString()).emit("bookingUpdated", populatedBooking);
    io.to(professionalUserId.toString()).emit("bookingUpdated", populatedBooking);

    return res.status(201).json({ success: true, message: "Booking confirmed successfully.", booking: populatedBooking });
  } catch (error) {
    console.error("Confirm Pickup Hire Error:", error);
    return res.status(500).json({ success: false, message: "Unable to confirm pickup booking." });
  }
};
