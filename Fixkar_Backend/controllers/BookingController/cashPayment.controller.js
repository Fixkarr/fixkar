import { Booking } from "../../models/bookingModel.js";
import { Payment } from "../../models/paymentModel.js";
import { Wallet } from "../../models/walletModel.js";
import { WalletTransaction } from "../../models/walletTransactionModel.js";
import { io } from "../../server.js";
import { Offer } from "../Admin/AdminModels/offer.model.js";
import { OfferUsage } from "../Admin/AdminModels/offerUsage.model.js";
import { PlatformTransaction } from "../Admin/AdminModels/platformTransaction.js";
import { rewardCompletedBookingCredits } from "../../utils/creditRewards.js";

export const confirmCashPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId)
      .populate({ path: "customerId", populate: { path: "userId", model: "User", select: "fullName" } })
      .populate({ path: "professionalId", select: "profilePicture address userId", populate: [{ path: "userId", model: "User", select: "fullName" }, { path: "profession", select: "name image skills commission", populate: { path: "skills", select: "name" } }, { path: "selectedSkills", select: "name" }] })
      .populate('review');

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.professionalId.userId._id.toString() !== req.userId.toString()) return res.status(403).json({ message: "Not authorized to confirm this payment" });
    if (booking.status === "completed") return res.status(400).json({ message: "Booking already completed" });

    const fullAmount = booking.isPriceLocked ? Number(booking.totalAmount) || 0 : (Number(booking.quoteAmount) || 0) + (Number(booking.visitingCharge) || 0);
    if (!fullAmount || fullAmount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const discountAmount = booking.offerLocked && booking.discountAmount ? booking.discountAmount : 0;
    const alreadyPaid = await Payment.findOne({ bookingId, status: "paid" });
    if (alreadyPaid) return res.status(400).json({ message: "Payment already confirmed" });

    const payment = await Payment.create({ bookingId: booking._id, customerId: booking.customerId._id, professionalId: booking.professionalId._id, amount: fullAmount - discountAmount, status: "paid", reason: "SERVICE_PAYMENT", paymentType: "FINAL", paymentMode: "CASH", discountAmount, paidAt: new Date() });

    booking.status = "completed";
    booking.currentPaymentId = payment._id;
    booking.completedAt = new Date();
    await booking.save();

    let wallet = await Wallet.findOne({ professionalId: booking.professionalId._id });
    if (!wallet) wallet = await Wallet.create({ professionalId: booking.professionalId._id });

    const COMMISSION_PERCENT = Number(booking.professionalId.profession.commission);
    const commission = (fullAmount * COMMISSION_PERCENT) / 100;
    const professionalAmount = fullAmount - commission;
    await Wallet.findOneAndUpdate({ professionalId: booking.professionalId._id }, { $inc: { pendingBalance: (discountAmount - commission), totalEarned: (fullAmount - commission) } }, { new: true, upsert: true });

    try { await rewardCompletedBookingCredits({ booking, walletId: wallet._id, professionalEarnings: professionalAmount }); }
    catch (creditError) { console.error("Unable to award booking credits:", creditError); }

    const customerPaidAmount = fullAmount - discountAmount;
    await PlatformTransaction.create({ bookingId: booking._id, paymentId: payment._id, professionalId: booking.professionalId._id, paymentMode: "CASH", grossAmount: fullAmount, customerPaidAmount, discountAmount, professionalAmount, commission, profitOrLoss: commission - discountAmount });
    await WalletTransaction.create({ walletId: wallet._id, type: "CREDIT", grossAmount: fullAmount, commission, professionalAmount, reason: "SERVICE_PAYMENT", bookingId: booking._id, paymentMode: "CASH" });

    if (booking.offerLocked && booking.offerId) {
      await OfferUsage.create({ offerId: booking.offerId, userId: booking.customerId.userId._id, bookingId: booking._id, discountAmount, paymentMode: "CASH" });
      await Offer.findByIdAndUpdate(booking.offerId, { $inc: { usedCount: 1 } });
    }

    io.to(booking.customerId.userId._id.toString()).emit("bookingUpdated", booking);
    io.to(booking.professionalId.userId._id.toString()).emit("bookingUpdated", booking);
    return res.status(200).json({ success: true, message: "Cash payment confirmed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cash payment confirmation failed" });
  }
};
