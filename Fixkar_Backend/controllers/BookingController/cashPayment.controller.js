import mongoose from "mongoose";
import { Booking } from "../../models/bookingModel.js";
import { Payment } from "../../models/paymentModel.js";
import { Wallet } from "../../models/walletModel.js";
import { WalletTransaction } from "../../models/walletTransactionModel.js";
import { io } from "../../server.js";
import { PlatformTransaction } from "../Admin/AdminModels/platformTransaction.js";
import { rewardCompletedBookingCredits } from "../../utils/creditRewards.js";
import { redeemCustomerCoupon } from "../../services/coupon.service.js";

export const confirmCashPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId)
      .populate({ path: "customerId", populate: { path: "userId", model: "User", select: "fullName" } })
      .populate({ path: "professionalId", select: "profilePicture address userId", populate: [{ path: "userId", model: "User", select: "fullName" }, { path: "profession", select: "name image skills commission", populate: { path: "skills", select: "name" } }, { path: "selectedSkills", select: "name" }] })
      .populate("review").session(session);
    if (!booking) throw new Error("Booking not found");
    if (booking.professionalId.userId._id.toString() !== req.userId.toString()) throw new Error("Not authorized to confirm this payment");
    if (booking.status === "completed") throw new Error("Booking already completed");
    const fullAmount = booking.isPriceLocked ? Number(booking.totalAmount) || 0 : (Number(booking.quoteAmount) || 0) + (Number(booking.visitingCharge) || 0);
    if (!fullAmount || fullAmount <= 0) throw new Error("Invalid amount");
    const discountAmount = booking.offerLocked && booking.discountAmount ? booking.discountAmount : 0;
    if (await Payment.findOne({ bookingId, status: "paid" }).session(session)) throw new Error("Payment already confirmed");

    const payment = await Payment.create([{ bookingId: booking._id, customerId: booking.customerId._id, professionalId: booking.professionalId._id, amount: fullAmount - discountAmount, status: "paid", reason: "SERVICE_PAYMENT", paymentType: "FINAL", paymentMode: "CASH", discountAmount, paidAt: new Date() }], { session });
    booking.status = "completed"; booking.currentPaymentId = payment[0]._id; booking.completedAt = new Date();

    const COMMISSION_PERCENT = Number(booking.professionalId.profession.commission);
    const commission = (fullAmount * COMMISSION_PERCENT) / 100;
    const professionalAmount = fullAmount - commission;
    const wallet = await Wallet.findOneAndUpdate({ professionalId: booking.professionalId._id }, { $inc: { pendingBalance: professionalAmount, totalEarned: professionalAmount }, $setOnInsert: { professionalId: booking.professionalId._id } }, { new: true, upsert: true, session });
    await rewardCompletedBookingCredits({ booking, walletId: wallet._id, professionalEarnings: professionalAmount, session });
    if (booking.offerLocked && booking.offerId) await redeemCustomerCoupon({ userId: booking.customerId.userId._id, bookingId: booking._id, discountAmount, paymentMode: "CASH", session });

    await PlatformTransaction.create([{ bookingId: booking._id, paymentId: payment[0]._id, professionalId: booking.professionalId._id, paymentMode: "CASH", grossAmount: fullAmount, customerPaidAmount: fullAmount - discountAmount, discountAmount, professionalAmount, commission, profitOrLoss: commission - discountAmount }], { session });
    const walletTransaction = await WalletTransaction.create([{ walletId: wallet._id, type: "CREDIT", grossAmount: fullAmount, commission, professionalAmount, reason: "SERVICE_PAYMENT", bookingId: booking._id, paymentMode: "CASH" }], { session });
    booking.walletTransaction = walletTransaction[0]._id;
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();
    io.to(booking.customerId.userId._id.toString()).emit("bookingUpdated", booking);
    io.to(booking.professionalId.userId._id.toString()).emit("bookingUpdated", booking);
    return res.status(200).json({ success: true, message: "Cash payment confirmed successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    const status = /not authorized/i.test(error.message) ? 403 : /not found|already|invalid/i.test(error.message) ? 400 : 500;
    return res.status(status).json({ message: error.message || "Cash payment confirmation failed" });
  }
};
