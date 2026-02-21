import { Booking } from "../../models/bookingModel.js";
import { io } from "../../server.js";
import { Offer } from "../Admin/AdminModels/offer.model.js";
import { OfferUsage } from "../Admin/AdminModels/offerUsage.model.js";

export const applyOfferToBooking = async (req, res) => {
  try {
    const { bookingId, offerId } = req.body;
    const userId = req.userId;

    if (!bookingId || !offerId) {
      return res.status(400).json({
        message: "BookingId and OfferId required"
      });
    }

    // 🔹 Booking fetch
   
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
     populate: [{
      path: "userId",
      model: "User",
      select: "fullName",
    },
  { path: "profession", select: "name image skills", populate: { path: "skills", select: "name" } },
    {path : "selectedSkills", select : "name"}
]
  }).populate('review')


    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔐 Only booking owner apply kar sakta hai
    if (booking.customerId.userId._id.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    // 🔹 Status validation
    if (booking.status !== "in-progress") {
      return res.status(400).json({
        message: "Invalid booking status"
      });
    }

    if (!booking.quoteAmount) {
      return res.status(400).json({
        message: "Quote not sent yet"
      });
    }

    if (booking.offerLocked) {
      return res.status(400).json({
        message: "Offer already applied"
      });
    }

    const offer = await Offer.findById(offerId);

    if (!offer || !offer.isActive) {
      return res.status(400).json({
        message: "Invalid offer"
      });
    }

    const now = new Date();

    if (offer.startDate > now || offer.endDate < now) {
      return res.status(400).json({
        message: "Offer expired"
      });
    }

    // 🔹 Service validation
    if (
      offer.serviceId.length &&
      !offer.serviceId
        .map(id => id.toString())
        .includes(booking.professionalId.profession._id.toString())
    ) {
      return res.status(400).json({
        message: "Offer not valid for this service"
      });
    }

    // 🔹 Min booking amount
    if (
      offer.minBookingAmount &&
      booking.quoteAmount < offer.minBookingAmount
    ) {
      return res.status(400).json({
        message: "Minimum booking amount not satisfied"
      });
    }

    // 🔹 Global usage limit
    if (
      offer.usageLimit &&
      offer.usedCount >= offer.usageLimit
    ) {
      return res.status(400).json({
        message: "Offer usage limit exceeded"
      });
    }

    // 🔹 Per user limit
    const userUsageCount = await OfferUsage.countDocuments({
      offerId,
      userId: booking.customerId.userId._id
    });

    if (
      offer.perUserLimit &&
      userUsageCount >= offer.perUserLimit
    ) {
      return res.status(400).json({
        message: "You have already used this offer"
      });
    }

    // 🔹 New customer only
    if (offer.newCustomerOnly) {
      const completedCount = await Booking.countDocuments({
        customerId: booking.customerId.userId._id,
        status: "completed"
      });

      if (completedCount > 0) {
        return res.status(400).json({
          message: "Offer valid for new customers only"
        });
      }
    }

    // 🔹 Calculate discount
    const baseAmount =
      booking.quoteAmount + booking.visitingCharge;

    let discountAmount = 0;

    if (offer.discountType === "percentage") {
      discountAmount = Math.round(
        (baseAmount * offer.discountValue) / 100
      );

      if (offer.maxDiscount) {
        discountAmount = Math.min(
          discountAmount,
          offer.maxDiscount
        );
      }
    } else {
      discountAmount = offer.discountValue;
    }

    if (discountAmount <= 0) {
      return res.status(400).json({
        message: "Invalid discount"
      });
    }

    if (discountAmount >= baseAmount) {
        return res.status(400).json({
            message: "Invalid discount calculation"
        });
    }

    const finalPayable = baseAmount - discountAmount;

    if (finalPayable <= 0) {
      return res.status(400).json({
        message: "Invalid final amount"
      });
    }

    // 🔒 Freeze offer in booking
    booking.offerId = offer._id;
    booking.discountAmount = discountAmount;
    booking.finalCustomerPayable = finalPayable;
    booking.offerLocked = true;

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
      success: true,
      discountAmount,
      finalPayable
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to apply offer"
    });
  }
};
