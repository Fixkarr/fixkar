import mongoose from "mongoose";
import { Booking } from "../models/bookingModel.js";
import { Customer, Professional } from "../models/userModel.js";
import { Offer } from "../controllers/Admin/AdminModels/offer.model.js";
import { OfferClaim } from "../controllers/Admin/AdminModels/offerClaim.model.js";
import { OfferUsage } from "../controllers/Admin/AdminModels/offerUsage.model.js";

export const normalizeCouponCode = (code) => String(code || "").trim().toUpperCase();

export const getUserAudience = async (userId) => {
  if (await Customer.exists({ userId })) return "customer";
  if (await Professional.exists({ userId })) return "professional";
  return null;
};

export const getCoupon = async (code, session = null) => {
  const couponCode = normalizeCouponCode(code);
  if (!couponCode) return null;
  return Offer.findOne({ couponCode }).session(session);
};

export const validateCoupon = async ({ userId, couponCode, bookingId = null, session = null }) => {
  const normalizedCode = normalizeCouponCode(couponCode);
  if (!normalizedCode) throw new Error("Coupon code is required");

  const audience = await getUserAudience(userId);
  if (!audience) throw new Error("User role could not be determined");

  const offer = await getCoupon(normalizedCode, session);
  if (!offer || offer.archivedAt) throw new Error("Invalid coupon code");
  if (!offer.isActive) throw new Error("This coupon is inactive");

  // Customer discounts and professional rewards share the coupon namespace,
  // but a coupon is never exposed as an offer feed.
  if (!offer.audience.includes(audience)) throw new Error("This coupon is not available for your account");

  const now = new Date();
  if (now < offer.startDate) throw new Error("This coupon is not active yet");
  if (now > offer.endDate) throw new Error("This coupon has expired");
  if (offer.usageLimit != null && offer.usedCount >= offer.usageLimit) throw new Error("This coupon has reached its usage limit");

  const usedByUser = await OfferUsage.countDocuments({
    offerId: offer._id,
    userId,
    status: "used",
  }).session(session);
  if (usedByUser >= offer.perUserLimit) throw new Error("You have reached this coupon's usage limit");

  if (offer.newCustomerOnly && audience === "customer") {
    const customer = await Customer.findOne({ userId }).select("_id").session(session);
    const completedCount = await Booking.countDocuments({ customerId: customer?._id, status: "completed" }).session(session);
    if (completedCount > 0) throw new Error("This coupon is for new customers only");
  }

  let booking = null;
  if (bookingId) {
    if (audience !== "customer") throw new Error("This coupon cannot be applied to a customer booking");
    if (!mongoose.isValidObjectId(bookingId)) throw new Error("Invalid booking ID");

    const customer = await Customer.findOne({ userId }).select("_id").session(session);
    booking = await Booking.findOne({ _id: bookingId, customerId: customer?._id })
      .populate({ path: "professionalId", select: "profession" })
      .session(session);

    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "in-progress") throw new Error("Coupon can only be applied while the service is in progress");
    if (booking.offerLocked) throw new Error("A coupon is already locked on this booking");

    const serviceId = booking.service || booking.professionalId?.profession;
    if (offer.serviceId?.length && (!serviceId || !offer.serviceId.some((id) => id.toString() === serviceId.toString()))) {
      throw new Error("This coupon is not valid for this service");
    }

    const baseAmount = booking.isPriceLocked
      ? Number(booking.totalAmount || 0)
      : Number(booking.quoteAmount || 0) + Number(booking.visitingCharge || 0);

    if (baseAmount <= 0) throw new Error("Invalid booking amount");
    if (offer.minBookingAmount != null && baseAmount < offer.minBookingAmount) {
      throw new Error(`Minimum booking amount for this coupon is ₹${offer.minBookingAmount}`);
    }

    let discount = offer.discountType === "percentage"
      ? (baseAmount * offer.discountValue) / 100
      : offer.discountValue;
    if (offer.maxDiscount != null) discount = Math.min(discount, offer.maxDiscount);
    discount = Math.round(discount * 100) / 100;
    if (discount <= 0 || discount >= baseAmount) throw new Error("Coupon discount is not valid for this booking");

    return { offer, booking, audience, couponCode: normalizedCode, baseAmount, discount, finalPayable: baseAmount - discount };
  }

  return { offer, audience, couponCode: normalizedCode };
};

export const claimCoupon = async ({ userId, couponCode }) => {
  const validated = await validateCoupon({ userId, couponCode });
  const normalizedCode = validated.couponCode;

  const existing = await OfferClaim.findOne({ offerId: validated.offer._id, userId });
  if (existing && ["claimed", "redeemed"].includes(existing.status)) return existing;

  return OfferClaim.create({ offerId: validated.offer._id, userId, couponCode: normalizedCode, status: "claimed" });
};
