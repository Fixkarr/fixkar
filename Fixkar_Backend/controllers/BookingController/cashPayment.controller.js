import { Booking } from "../../models/bookingModel.js";
import { Notification } from "../../models/notificationModel.js";
import { Payment } from "../../models/paymentModel.js";
import { Wallet } from "../../models/walletModel.js";
import { WalletTransaction } from "../../models/walletTransactionModel.js";
import { io } from "../../server.js";
import { pushNotification } from "../../services/pushNotification.js";
import { Offer } from "../Admin/AdminModels/offer.model.js";
import { OfferUsage } from "../Admin/AdminModels/offerUsage.model.js";

export const confirmCashPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
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
    select: "profilePicture address userId",
     populate: [{
      path: "userId",
      model: "User",
      select: "fullName",
    },
  { path: "profession", select: "name image skills commission", populate: { path: "skills", select: "name" } },
    {path : "selectedSkills", select : "name"}
]
  }).populate('review')

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }


    if (
  booking.professionalId.userId._id.toString() !== req.userId.toString()
) {
  return res.status(403).json({
    message: "Not authorized to confirm this payment",
  });
}

    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Booking already completed",
      });
    }

      const fullAmount =
      booking.quoteAmount + booking.visitingCharge;

     if (!fullAmount || fullAmount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

     const discountAmount =
      booking.offerLocked && booking.discountAmount
        ? booking.discountAmount
        : 0;

    // 3️⃣ Duplicate protection
    const alreadyPaid = await Payment.findOne({
      bookingId,
      status: "paid",
    });

    if (alreadyPaid) {
      return res.status(400).json({
        message: "payment already confirmed",
      });
    }

    // 4️⃣ Payment record (CASH)
    const payment = await Payment.create({
      bookingId: booking._id,
      customerId: booking.customerId._id,
      professionalId: booking.professionalId._id,
      amount : fullAmount,
      status: "paid",
      reason: "SERVICE_PAYMENT",
      paymentType: "FINAL",
      paymentMode: "CASH",
      discountAmount,
      paidAt: new Date(),
    });

    // 5️⃣ Booking completed
    booking.status = "completed";
    booking.currentPaymentId = payment._id;
    booking.completedAt = new Date();
    await booking.save();

    // 6️⃣ Wallet
    let wallet = await Wallet.findOne({
      professionalId: booking.professionalId._id,
    });

    if (!wallet) {
      wallet = await Wallet.create({
        professionalId: booking.professionalId._id,
      });
    }

    const COMMISSION_PERCENT = Number(booking.professionalId.profession.commission);
    const commission = Math.round((fullAmount * COMMISSION_PERCENT) / 100);
    const professionalAmount = fullAmount - commission;
    wallet.pendingBalance += (discountAmount - commission);
    wallet.totalEarned += (fullAmount - commission);

    await wallet.save();

    // 7️⃣ Wallet transaction (CASH)
    await WalletTransaction.create({
      walletId: wallet._id,
      type: "CREDIT",
      grossAmount: fullAmount,
      commission,
      professionalAmount,
      reason: "SERVICE_PAYMENT",
      bookingId: booking._id,
      paymentMode: "CASH",
    });

      if (booking.offerLocked && booking.offerId) {
      await OfferUsage.create({
        offerId: booking.offerId,
        userId: booking.customerId._id,
        bookingId: booking._id,
        discountAmount,
        paymentMode: "CASH",
      });

      await Offer.findByIdAndUpdate(
        booking.offerId,
        { $inc: { usedCount: 1 } }
      );
    }

    // 9️⃣ Socket updates
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
      message: "Cash payment confirmed successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cash payment confirmation failed" });
  }
};
