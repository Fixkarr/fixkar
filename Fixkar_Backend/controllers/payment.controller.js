import crypto from 'crypto'
import { Booking } from "../models/bookingModel.js";
import { Customer } from "../models/userModel.js";
import { Payment } from "../models/paymentModel.js";
import razorpayInstance from '../config/razorpay.js';
import { io } from '../server.js'
import { Wallet } from '../models/walletModel.js'
import { WalletTransaction } from '../models/walletTransactionModel.js'
import { Notification } from '../models/notificationModel.js';
import { pushNotification } from '../services/pushNotification.js';
import mongoose from 'mongoose';
import { Offer } from './Admin/AdminModels/offer.model.js';
import { OfferUsage } from './Admin/AdminModels/offerUsage.model.js';
import { PlatformTransaction } from './Admin/AdminModels/platformTransaction.js';
import { rewardCompletedBookingCredits } from "../utils/creditRewards.js";
export const createOrder = async (req, res) => {
  try {
    const { bookingId, paymentType } = req.body;

    // 1️⃣ Booking lao
    const customer = await Customer.findOne({ userId: req.userId }).select("_id");
    if (!customer) {
      return res.status(403).json({ message: "Only customers can make booking payments." });
    }

    const booking = await Booking.findOne({ _id: bookingId, customerId: customer._id }).populate({
      path: "professionalId",
      select: "profession"
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found or not available to you" });
    }

    let discountAmount = 0;
    let amount = 0
    let paymentReason = "";

    // 2️⃣ Payment type ke hisaab se amount decide
    if (paymentType === "FINAL") {
      if (["cancelled", "rejected", "completed"].includes(booking.status)) {
        return res.status(400).json({ message: "Final payment is not available for this booking." });
      }
      if (booking.status !== "in-progress") {
        return res.status(400).json({ message: "Final payment is available after the service starts." });
      }
      // Professional quote wala case
      if (!booking.isPriceLocked && !booking.quoteAmount) {
        return res.status(400).json({
          message: "Quote not sent yet"
        });
      }
      const fullAmount = booking.isPriceLocked
        ? booking.totalAmount
        : booking.quoteAmount + booking.visitingCharge;

      amount = booking.offerLocked && booking.finalCustomerPayable
        ? booking.finalCustomerPayable
        : fullAmount;

      discountAmount = booking.offerLocked
        ? booking.discountAmount
        : 0;

      paymentReason = "SERVICE_PAYMENT";


    } else if (paymentType === "CANCEL") {
      // Late cancellation case
      const cancellationFee = 50;
      amount = cancellationFee + (booking.visitingCharge || 0);
      paymentReason = "LATE_CANCELLATION_FEE";

    } else {
      return res.status(400).json({ message: "Invalid payment type" });
    }

    // 3️⃣ Security check
    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }
    // 🔐 DUPLICATE PAYMENT PROTECTION
    const alreadyPaid = await Payment.findOne({
      bookingId,
      paymentType,
      status: "paid"
    });

    if (alreadyPaid) {
      return res.status(400).json({
        message: "Payment already completed for this booking"
      });
    }

    if (
      paymentType === "FINAL" &&
      booking.status === "completed"
    ) {
      return res.status(400).json({
        message: "Service payment already done"
      });
    }

    if (
      paymentType === "CANCEL" &&
      booking.status === "cancelled"
    ) {
      return res.status(400).json({
        message: "Cancellation already processed"
      });
    }

    // 4️⃣ Payment record banao
    const payment = await Payment.create({
      bookingId: booking._id,
      customerId: booking.customerId,
      professionalId: booking.professionalId,
      amount,
      status: "created",
      reason: paymentReason,
      paymentType,
      discountAmount
    });

    // 5️⃣ Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `booking_${booking._id}_${paymentType}`,
    });

    if (!order) {
      return res.status(400).json({
        message: "Failed to place order!"
      })
    }

    // 6️⃣ Save order ID
    payment.razorpayOrderId = order.id;
    await payment.save();

    // 7️⃣ Booking link
    booking.currentPaymentId = payment._id;
    await booking.save();

    // 8️⃣ Response
    res.status(200).json({
      success: true,
      order,
      paymentId: payment._id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const customer = await Customer.findOne({ userId: req.userId }).select("_id");
    const customerBooking = customer && await Booking.findOne({ _id: bookingId, customerId: customer._id }).select("_id status");
    if (!customerBooking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: "You are not authorized to verify this payment." });
    }
    if (["cancelled", "rejected", "completed"].includes(customerBooking.status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Payment is not available for this booking." });
    }

    // generating signature 
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {

      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Invalid payment signature"
      });
    }


    const payment = await Payment.findOneAndUpdate(
      {
        bookingId,
        razorpayOrderId: razorpay_order_id,
        status: { $ne: "paid" }
      },
      {
        $set: {
          status: "paid",
          razorpayPaymentId: razorpay_payment_id,
          paidAt: new Date(),
          paymentMode: "ONLINE"
        }
      },
      {
        new: true,
        session
      }
    );

    if (!payment) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: "Payment already processed or invalid"
      });
    }

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
        { path: "profession", select: "name image skills commission", populate: { path: "skills", select: "name" } },
        { path: "selectedSkills", select: "name" }
        ]
      }).populate('review').session(session);


    if (["completed", "cancelled"].includes(booking.status)) {
      throw new Error("Booking already completed!");
    }


    if (payment.paymentType === "FINAL") {
      booking.status = 'completed'
    }
    if (payment.paymentType === "CANCEL") {
      booking.status = 'cancelled'
    }

    const COMMISSION_PERCENT = Number(booking.professionalId.profession.commission);

    const quoteAmount = booking.isPriceLocked
      ? Number(booking.serviceCharge) || 0
      : Number(booking.quoteAmount) || 0;
    const visitingCharge = Number(booking.visitingCharge) || 0;


    let fullAmount = 0;
    let commission = 0;
    let professionalAmount = 0;

    const lateCancellationFee = 50; // fallback

    if (payment.paymentType === "FINAL") {
      fullAmount = booking.isPriceLocked
        ? Number(booking.totalAmount) || 0
        : quoteAmount + visitingCharge;

      commission = 
        (fullAmount * COMMISSION_PERCENT) / 100;

      professionalAmount = fullAmount - commission;
    }

    if (payment.paymentType === "CANCEL") {
      // only visiting charge + late fee
      fullAmount = visitingCharge + lateCancellationFee;

      // commission ONLY on visiting charge
      const commissionOnVisiting = 
        (visitingCharge * COMMISSION_PERCENT) / 100
      ;

      commission = commissionOnVisiting;


      professionalAmount =
        (visitingCharge - commissionOnVisiting) + lateCancellationFee;
    }


    let notificationTitle = "";
    let notificationMessage = "";
    let type = "";


    const wallet = await Wallet.findOneAndUpdate(
      {
        professionalId: booking.professionalId._id
      },
      {
        $inc: {
          pendingBalance: professionalAmount,
          totalEarned: professionalAmount
        }
      },
      {
        new: true,
        upsert: true,
        session
      }
    );

    if (payment.paymentType === "FINAL") {
      await rewardCompletedBookingCredits({
        booking,
        walletId: wallet._id,
        professionalEarnings: professionalAmount,
        session,
      });
    }

    if (booking.offerLocked && booking.offerId) {
      await OfferUsage.create([{
        offerId: booking.offerId,
        userId: booking.customerId.userId,
        bookingId: booking._id,
        discountAmount: payment.discountAmount,
        paymentMode: "ONLINE"
      }], { session });

      await Offer.findByIdAndUpdate(
        booking.offerId,
        { $inc: { usedCount: 1 } },
        { session }
      );
    }


    if (payment.paymentType === "FINAL") {
      type = "booking_completed";
      notificationTitle = "Work Completed & Payment Received";
      notificationMessage = `${booking.customerName}'s Work has been completed successfully. ₹${professionalAmount} has been added to your wallet.`;
    }

    if (payment.paymentType === "CANCEL") {
      type = "booking_cancelled";
      notificationTitle = "Work Cancelled & Payment Settled";
      notificationMessage = `${booking.customerName} has cancelled the work. ₹${professionalAmount} has been added to your wallet as settlement.`;
    }


    await booking.save({ session });

    const walletTransaction = await WalletTransaction.create([{
      walletId: wallet._id,
      type: "CREDIT",
      grossAmount: fullAmount,
      commission,
      professionalAmount,
      reason: payment.reason,
      bookingId: booking._id,
      paymentMode: "ONLINE"
    }], { session })

    const customerPaidAmount = payment.amount;

    await PlatformTransaction.create([{

      bookingId: booking._id,

      paymentId: payment._id,

      professionalId: booking.professionalId._id,

      paymentMode: "ONLINE",

      grossAmount: fullAmount,

      customerPaidAmount,

      discountAmount: payment.discountAmount,

      commission,

      professionalAmount,

      profitOrLoss: commission - payment.discountAmount

    }], { session }); 


    booking.walletTransaction = walletTransaction[0]._id;
    await booking.save({ session })

    await session.commitTransaction();
    session.endSession();


    const notification = await Notification.create({
      userId: booking.professionalId.userId._id,
      title: notificationTitle,
      message: notificationMessage,
      type: type,
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

    res.status(200).json({
      success: true,
      message: "Payment Successful!"
    })
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Payment verification failed" });
  }
}
