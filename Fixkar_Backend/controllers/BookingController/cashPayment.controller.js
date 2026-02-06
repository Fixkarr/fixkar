import { Booking } from "../../models/bookingModel.js";
import { Notification } from "../../models/notificationModel.js";
import { Payment } from "../../models/paymentModel.js";
import { Wallet } from "../../models/walletModel.js";
import { WalletTransaction } from "../../models/walletTransactionModel.js";
import { io } from "../../server.js";
import { pushNotification } from "../../services/pushNotification.js";

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
  { path: "profession", select: "name image skills", populate: { path: "skills", select: "name" } },
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

    // 2️⃣ Amount calculate (FINAL CASH)
    const amount = booking.quoteAmount + booking.visitingCharge;

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

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
      amount,
      status: "paid",
      reason: "SERVICE_PAYMENT",
      paymentType: "FINAL",
      paymentMode: "CASH",
      paidAt: new Date(),
    });

    // 5️⃣ Booking completed
    booking.status = "completed";
    booking.currentPaymentId = payment._id;
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

    const COMMISSION_PERCENT = Number(process.env.COMMISSION_PERCENT);
    const commission = Math.round((amount * COMMISSION_PERCENT) / 100);
    const professionalAmount = amount - commission;
    wallet.pendingBalance -= commission;
    wallet.totalEarned += professionalAmount;

    await wallet.save();

    // 7️⃣ Wallet transaction (CASH)
    await WalletTransaction.create({
      walletId: wallet._id,
      type: "CREDIT",
      grossAmount: amount,
      commission,
      professionalAmount,
      reason: "SERVICE_PAYMENT",
      bookingId: booking._id,
      paymentMode: "CASH",
    });

    // 8️⃣ Notification
    const notification = await Notification.create({
      userId: booking.professionalId.userId._id,
      title: "Cash Payment Confirmed",
      message: `₹${professionalAmount} added to your wallet after cash payment confirmation.`,
      type: "booking_completed",
      relatedId: booking._id,
      isRead: false,
    });

    await pushNotification({
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      redirectUrl: `/professional/bookings/${booking._id}`,
    });

    // 9️⃣ Socket updates
    io.to(booking.customerId.userId._id.toString()).emit(
      "bookingUpdated",
      booking
    );

    io.to(booking.professionalId.userId._id.toString()).emit(
      "bookingUpdated",
      booking
    );

    io.to(booking.professionalId.userId._id.toString()).emit(
      "notification",
      notification
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
