import crypto from 'crypto'
import { Booking } from "../models/bookingModel.js";
import { Payment } from "../models/paymentModel.js";
import razorpayInstance from '../config/razorpay.js';
import {io} from '../server.js'
import {Wallet} from '../models/walletModel.js'
import {WalletTransaction } from '../models/walletTransactionModel.js'
import { Notification } from '../models/notificationModel.js';
import { pushNotification } from '../services/pushNotification.js';
export const createOrder = async (req, res) => {
  try {
    const { bookingId, paymentType } = req.body;

    // 1️⃣ Booking lao
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    let amount = 0;
    let paymentReason = "";

    // 2️⃣ Payment type ke hisaab se amount decide
    if (paymentType === "FINAL") {
      // Professional quote wala case
      amount = booking.quoteAmount + booking.visitingCharge;
      paymentReason = "SERVICE_PAYMENT";

    } else if (paymentType === "CANCEL") {
      // Late cancellation case
      const cancellationFee = 50;
      const visitingCharge = booking.visitingCharge || 0;

      amount = cancellationFee + visitingCharge;
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
    });

    // 5️⃣ Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `booking_${booking._id}_${paymentType}`,
    });

    if(!order){
        return res.status(400).json({
            message : "Failed to place order!"
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
      key: process.env.RAZORPAY_API_KEY,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

export const verifyPayment = async (req,res)=>{
    try {
        const {bookingId, paymentType, razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;


        const payment = await Payment.findOne({
            bookingId,
            razorpayOrderId : razorpay_order_id
        });

        if(!payment){
             return res.status(404).json({ message: "Payment record not found" });
        }

         if (payment.status === "paid") {
            return res.status(400).json({
            message: "payment already paid!",
        });
        }
            // generating signature 
        const body = razorpay_order_id + "|" + razorpay_payment_id;

         const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest("hex");

        if (expectedSignature !== razorpay_signature) {
      payment.status = "failed";
      await payment.save();

      return res.status(400).json({ message: "Something went wrong! please try again" });
    }

        payment.status = 'paid'
          payment.razorpayPaymentId = razorpay_payment_id;
        payment.paidAt = new Date();
        await payment.save();

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
  });

        if(paymentType === "FINAL"){
            booking.status = 'completed'
        }
        if(paymentType === "CANCEL"){
            booking.status = 'cancelled'
        }

        await booking.save()

         let wallet = await Wallet.findOne({professionalId : booking.professionalId});
        if(!wallet){
          wallet = await Wallet.create({
            professionalId : booking.professionalId
          })
        }



        const COMMISSION_PERCENT = Number(process.env.COMMISSION_PERCENT) || 5;
        const commission = Math.round((payment.amount * COMMISSION_PERCENT)/100);

        const professionalAmount = payment.amount - commission

        wallet.pendingBalance += professionalAmount;
        wallet.totalEarned += professionalAmount;

        await wallet.save();

        let notificationTitle = "";
let notificationMessage = "";
let type = "";

if (paymentType === "FINAL") {
  notificationTitle = "Work Completed & Payment Received";
  notificationMessage = `Work has been completed successfully. ₹${professionalAmount} has been added to your wallet.`;
  type = "booking_completed";
}

if (paymentType === "CANCEL") {
  notificationTitle = "Work Cancelled & Payment Settled";
  notificationMessage = `Work has been cancelled. ₹${professionalAmount} has been added to your wallet as settlement.`;
  type = "booking_cancelled";
  
}

await Notification.create({
  userId: booking.professionalId.userId._id,
  title: notificationTitle,
  message: notificationMessage,
  type: type,
  relatedId: booking._id,
  isRead: false,
});

  const notificationPayload = {
  userId: booking.professionalId.userId._id,
  title: notificationTitle,
  message: notificationMessage,
  redirectUrl: `/professional/bookings/${booking._id}`, // OPTIONAL
};

  await pushNotification(notificationPayload);

io.to(booking.professionalId.userId._id.toString()).emit(
  "notification",
  {
    title: notificationTitle,
    message: notificationMessage,
    type: type,
    relatedId: booking._id,
    isRead: false,
  }
);

        await WalletTransaction.create({
          walletId : wallet._id,
          type : "CREDIT",
          grossAmount : payment.amount,
          commission,
          professionalAmount,
          reason : payment.reason,
          bookingId : booking._id,
          status : "pending"
        })

         io.to(booking.customerId.userId._id.toString()).emit(
                     "bookingUpdated",
                     booking
                   );
             
                   io.to(booking.professionalId.userId._id.toString()).emit(
                     "bookingUpdated",
                     booking
                   );

        res.status(200).json({
            success : true,
            message : "Payment Successful!"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Payment verification failed" });
    }
}