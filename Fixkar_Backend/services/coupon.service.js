import mongoose from "mongoose";
import { Booking } from "../models/bookingModel.js";
import { Customer, Professional } from "../models/userModel.js";
import { Offer } from "../controllers/Admin/AdminModels/offer.model.js";
import { OfferClaim } from "../controllers/Admin/AdminModels/offerClaim.model.js";
import { OfferUsage } from "../controllers/Admin/AdminModels/offerUsage.model.js";
import { Wallet } from "../models/walletModel.js";
import { CreditTransaction } from "../models/creditTransactionModel.js";

export const normalizeCouponCode = (code) => String(code || "").trim().toUpperCase();
export const getUserAudience = async (userId) => { if (await Customer.exists({ userId })) return "customer"; if (await Professional.exists({ userId })) return "professional"; return null; };
export const getCoupon = async (code, session = null) => { const couponCode = normalizeCouponCode(code); if (!couponCode) return null; return Offer.findOne({ couponCode }).session(session); };

export const validateCoupon = async ({ userId, couponCode, bookingId = null, session = null }) => {
  const normalizedCode = normalizeCouponCode(couponCode);
  if (!normalizedCode) throw new Error("Coupon code is required");
  const audience = await getUserAudience(userId);
  if (!audience) throw new Error("User role could not be determined");
  const offer = await getCoupon(normalizedCode, session);
  if (!offer || offer.archivedAt) throw new Error("Invalid coupon code");
  if (!offer.isActive) throw new Error("This coupon is inactive");
  if (!offer.audience.includes(audience)) throw new Error("This coupon is not available for your account");
  if (offer.benefitType === "CUSTOMER_DISCOUNT" && audience !== "customer") throw new Error("This coupon is for customers only");
  if (offer.benefitType === "PROFESSIONAL_REWARD" && audience !== "professional") throw new Error("This coupon is for professionals only");
  const now = new Date();
  if (now < offer.startDate) throw new Error("This coupon is not active yet");
  if (now > offer.endDate) throw new Error("This coupon has expired");
  if (offer.usageLimit != null && offer.usedCount >= offer.usageLimit) throw new Error("This coupon has reached its usage limit");
  const usedByUser = await OfferUsage.countDocuments({ offerId: offer._id, userId, status: "used" }).session(session);
  if (usedByUser >= offer.perUserLimit) throw new Error("You have reached this coupon's usage limit");

  if (offer.newCustomerOnly && audience === "customer") {
    const customer = await Customer.findOne({ userId }).select("_id").session(session);
    const completedCount = await Booking.countDocuments({ customerId: customer?._id, status: "completed" }).session(session);
    if (completedCount > 0) throw new Error("This coupon is for new customers only");
  }
  if (offer.benefitType === "PROFESSIONAL_REWARD" && !bookingId) return { offer, audience, couponCode: normalizedCode, rewardCredits: Number(offer.rewardValue || 0) };
  if (!bookingId) return { offer, audience, couponCode: normalizedCode };
  if (audience !== "customer") throw new Error("This coupon cannot be applied to a customer booking");
  if (!mongoose.isValidObjectId(bookingId)) throw new Error("Invalid booking ID");
  const customer = await Customer.findOne({ userId }).select("_id").session(session);
  const booking = await Booking.findOne({ _id: bookingId, customerId: customer?._id }).populate({ path: "professionalId", select: "profession" }).session(session);
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "in-progress") throw new Error("Coupon can only be applied while the service is in progress");
  if (booking.offerLocked) throw new Error("A coupon is already locked on this booking");
  const serviceId = booking.service || booking.professionalId?.profession;
  if (offer.serviceId?.length && (!serviceId || !offer.serviceId.some((id) => id.toString() === serviceId.toString()))) throw new Error("This coupon is not valid for this service");
  const baseAmount = booking.isPriceLocked ? Number(booking.totalAmount || 0) : Number(booking.quoteAmount || 0) + Number(booking.visitingCharge || 0);
  if (baseAmount <= 0) throw new Error("Invalid booking amount");
  if (offer.minBookingAmount != null && baseAmount < offer.minBookingAmount) throw new Error(`Minimum booking amount for this coupon is ₹${offer.minBookingAmount}`);
  let discount = offer.discountType === "percentage" ? (baseAmount * offer.discountValue) / 100 : offer.discountValue;
  if (offer.maxDiscount != null) discount = Math.min(discount, offer.maxDiscount);
  discount = Math.round(discount * 100) / 100;
  if (discount <= 0 || discount >= baseAmount) throw new Error("Coupon discount is not valid for this booking");
  return { offer, booking, audience, couponCode: normalizedCode, baseAmount, discount, finalPayable: Math.round((baseAmount - discount) * 100) / 100 };
};

export const claimCoupon = async ({ userId, couponCode }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validated = await validateCoupon({ userId, couponCode, session });
    const normalizedCode = validated.couponCode;
    const existing = await OfferClaim.findOne({ offerId: validated.offer._id, userId }).session(session);
    if (existing && ["claimed", "redeemed"].includes(existing.status)) { await session.commitTransaction(); return existing; }

    if (validated.offer.benefitType === "PROFESSIONAL_REWARD") {
      const limitFilter = validated.offer.usageLimit == null ? { _id: validated.offer._id } : { _id: validated.offer._id, $expr: { $lt: ["$usedCount", "$usageLimit"] } };
      const reservedOffer = await Offer.findOneAndUpdate(limitFilter, { $inc: { usedCount: 1 } }, { new: true, session });
      if (!reservedOffer) throw new Error("This coupon has reached its usage limit");
      const professional = await Professional.findOne({ userId }).select("_id").session(session);
      if (!professional) throw new Error("Professional account not found");
      const claim = await OfferClaim.create([{ offerId: validated.offer._id, userId, couponCode: normalizedCode, status: "redeemed", redeemedAt: new Date() }], { session });
      const wallet = await Wallet.findOneAndUpdate({ professionalId: professional._id }, { $setOnInsert: { professionalId: professional._id } }, { new: true, upsert: true, session });
      const credits = Number(validated.offer.rewardValue || 0);
      await Wallet.findByIdAndUpdate(wallet._id, { $inc: { "credits.balance": credits, "credits.lifetimeEarned": credits } }, { session });
      await CreditTransaction.create([{ walletId: wallet._id, professionalId: professional._id, type: "EARNED", source: "coupon_reward", credits, referenceId: claim[0]._id, referenceModel: "OfferClaim", description: `Coupon reward: ${normalizedCode}`, metadata: { offerId: validated.offer._id, couponCode: normalizedCode } }], { session });
      await OfferUsage.create([{ offerId: validated.offer._id, userId, bookingId: null, couponCode: normalizedCode, rewardCredits: credits, paymentMode: "REWARD", status: "used" }], { session });
      await session.commitTransaction();
      return claim[0];
    }

    const claim = await OfferClaim.create([{ offerId: validated.offer._id, userId, couponCode: normalizedCode, status: "claimed" }], { session });
    await session.commitTransaction();
    return claim[0];
  } catch (error) { await session.abortTransaction(); throw error; }
  finally { await session.endSession(); }
};
