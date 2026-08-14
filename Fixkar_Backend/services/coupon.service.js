import mongoose from "mongoose";
import { Booking } from "../models/bookingModel.js";
import { Customer, Professional } from "../models/userModel.js";
import { Offer } from "../controllers/Admin/AdminModels/offer.model.js";
import { OfferClaim } from "../controllers/Admin/AdminModels/offerClaim.model.js";
import { OfferUsage } from "../controllers/Admin/AdminModels/offerUsage.model.js";

export const normalizeCouponCode = (code) => String(code || "").trim().toUpperCase();
export const getUserAudience = async (userId, session = null) => {
  if (await Customer.exists({ userId }).session(session)) return "customer";
  if (await Professional.exists({ userId }).session(session)) return "professional";
  return null;
};
export const getCoupon = async (code, session = null) => {
  const couponCode = normalizeCouponCode(code);
  if (!couponCode) return null;
  return Offer.findOne({ couponCode }).session(session);
};

const assertCustomerCoupon = async ({ userId, offer, session }) => {
  if (!offer || offer.archivedAt) throw new Error("Invalid coupon code");
  if (!offer.isActive) throw new Error("This coupon is inactive");
  if (!Array.isArray(offer.audience) || offer.audience.length !== 1 || offer.audience[0] !== "customer") throw new Error("This coupon is available for customers only");
  if (offer.benefitType !== "CUSTOMER_DISCOUNT") throw new Error("This coupon is available for customers only");
  const now = new Date();
  if (now < offer.startDate) throw new Error("This coupon is not active yet");
  if (now > offer.endDate) throw new Error("This coupon has expired");
  if (offer.usageLimit != null && offer.usedCount >= offer.usageLimit) throw new Error("This coupon has reached its usage limit");

  if (offer.newCustomerOnly) {
    const customer = await Customer.findOne({ userId }).select("_id").session(session);
    const completedCount = customer ? await Booking.countDocuments({ customerId: customer._id, status: "completed" }).session(session) : 0;
    if (completedCount > 0) throw new Error("This coupon is for new customers only");
  }
};

export const validateCoupon = async ({ userId, couponCode, bookingId = null, session = null }) => {
  const normalizedCode = normalizeCouponCode(couponCode);
  if (!normalizedCode) throw new Error("Coupon code is required");
  const audience = await getUserAudience(userId, session);
  if (audience !== "customer") throw new Error("Coupons are available for customers only");
  const offer = await getCoupon(normalizedCode, session);
  await assertCustomerCoupon({ userId, offer, session });

  if (!bookingId) return { offer, audience, couponCode: normalizedCode };
  if (!mongoose.isValidObjectId(bookingId)) throw new Error("Invalid booking ID");
  const customer = await Customer.findOne({ userId }).select("_id").session(session);
  const booking = await Booking.findOne({ _id: bookingId, customerId: customer?._id }).populate({ path: "professionalId", select: "profession" }).session(session);
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "in-progress") throw new Error("Coupon can only be applied while the service is in progress");
  if (booking.offerLocked) throw new Error("A coupon is already locked on this booking");

  // Fixed-price bookings use totalAmount. Inspection/quote bookings use the
  // professional's quote plus visiting charge as the finalized amount.
  const baseAmount = booking.isPriceLocked
    ? Number(booking.totalAmount || 0)
    : Number(booking.quoteAmount || 0) + Number(booking.visitingCharge || 0);

  if (baseAmount <= 0) throw new Error("The booking price must be finalized before applying a coupon");

  const serviceId = booking.service || booking.professionalId?.profession;
  if (offer.serviceId?.length && (!serviceId || !offer.serviceId.some(id => id.toString() === serviceId.toString()))) throw new Error("This coupon is not valid for this service");
  if (offer.minBookingAmount != null && baseAmount < offer.minBookingAmount) throw new Error(`Minimum booking amount for this coupon is ₹${offer.minBookingAmount}`);
  let discount = offer.discountType === "percentage" ? (baseAmount * offer.discountValue) / 100 : offer.discountValue;
  if (offer.maxDiscount != null) discount = Math.min(discount, offer.maxDiscount);
  discount = Math.round(discount * 100) / 100;
  if (discount <= 0 || discount >= baseAmount) throw new Error("This coupon cannot make the booking payable amount zero");
  return { offer, booking, audience, couponCode: normalizedCode, baseAmount, discount, finalPayable: Math.round((baseAmount - discount) * 100) / 100 };
};

export const redeemCustomerCoupon = async ({ userId, bookingId, discountAmount, paymentMode, session = null }) => {
  const booking = await Booking.findById(bookingId).session(session);
  if (!booking?.offerLocked || !booking.offerId) throw new Error("No coupon is locked on this booking");
  const offer = await Offer.findById(booking.offerId).session(session);
  if (!offer || offer.benefitType !== "CUSTOMER_DISCOUNT") throw new Error("Coupon campaign not found");
  const claim = await OfferClaim.findOneAndUpdate(
    { offerId: offer._id, userId, $expr: { $lt: ["$redeemedCount", Number(offer.perUserLimit || 1)] }, status: { $in: ["claimed", "redeemed"] } },
    { $inc: { redeemedCount: 1 }, $set: { status: "redeemed", redeemedAt: new Date() } },
    { new: true, session }
  );
  if (!claim) throw new Error("You have reached this coupon's usage limit");
  const reservedOffer = await Offer.findOneAndUpdate(
    { _id: offer._id, $expr: { $or: [{ $eq: ["$usageLimit", null] }, { $lt: ["$usedCount", "$usageLimit"] }] } },
    { $inc: { usedCount: 1 } }, { new: true, session }
  );
  if (!reservedOffer) {
    await OfferClaim.findByIdAndUpdate(claim._id, { $inc: { redeemedCount: -1 }, $set: { status: "claimed", redeemedAt: null } }, { session });
    throw new Error("This coupon has reached its usage limit");
  }
  try {
    await OfferUsage.create([{ offerId: offer._id, userId, bookingId: booking._id, couponCode: booking.offerCode, offerSnapshot: booking.offerSnapshot, discountAmount: Number(discountAmount) || 0, paymentMode, status: "used" }], session ? { session } : {});
    return reservedOffer;
  } catch (error) {
    await Offer.findByIdAndUpdate(offer._id, { $inc: { usedCount: -1 } }, { session });
    await OfferClaim.findByIdAndUpdate(claim._id, { $inc: { redeemedCount: -1 }, $set: { status: "claimed", redeemedAt: null } }, { session });
    throw error;
  }
};

export const claimCoupon = async ({ userId, couponCode }) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validated = await validateCoupon({ userId, couponCode, session });
    const normalizedCode = validated.couponCode;
    const existing = await OfferClaim.findOne({ offerId: validated.offer._id, userId }).session(session);
    if (existing && ["claimed", "redeemed"].includes(existing.status)) {
      await session.commitTransaction();
      return existing;
    }
    if (existing?.status === "revoked") throw new Error("This coupon claim has been revoked");

    const claimData = {
      offerId: validated.offer._id,
      userId,
      couponCode: normalizedCode,
      status: "claimed",
      redeemedCount: existing?.redeemedCount || 0,
    };
    const claim = existing
      ? await OfferClaim.findByIdAndUpdate(existing._id, claimData, { new: true, session })
      : (await OfferClaim.create([claimData], { session }))[0];
    await session.commitTransaction();
    return claim;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
