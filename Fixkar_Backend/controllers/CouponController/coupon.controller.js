import { OfferClaim } from "../Admin/AdminModels/offerClaim.model.js";
import { claimCoupon, validateCoupon, normalizeCouponCode } from "../../services/coupon.service.js";

export const claimCouponController = async (req, res) => {
  try {
    const userId = req.userId;
    const { couponCode } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const claim = await claimCoupon({ userId, couponCode });
    return res.status(200).json({
      success: true,
      message: "Coupon claimed successfully",
      claim,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to claim coupon" });
  }
};

export const validateCouponController = async (req, res) => {
  try {
    const userId = req.userId;
    const { couponCode, bookingId } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await validateCoupon({ userId, couponCode, bookingId });
    return res.status(200).json({
      success: true,
      couponCode: normalizeCouponCode(couponCode),
      title: result.offer.offerTitle,
      discount: result.discount ?? null,
      finalPayable: result.finalPayable ?? null,
      message: bookingId ? "Coupon is valid for this booking" : "Coupon is valid",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Invalid coupon" });
  }
};

export const applyCouponToBookingController = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId, couponCode } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await validateCoupon({ userId, couponCode, bookingId });
    const claim = await OfferClaim.findOne({
      offerId: result.offer._id,
      userId,
      status: "claimed",
    });

    if (!claim) {
      return res.status(400).json({ message: "Claim this coupon before applying it to a booking" });
    }

    result.booking.offerId = result.offer._id;
    result.booking.discountAmount = result.discount;
    result.booking.finalCustomerPayable = result.finalPayable;
    result.booking.offerLocked = true;
    await result.booking.save();

    claim.bookingId = result.booking._id;
    await claim.save();

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      couponCode: result.couponCode,
      discountAmount: result.discount,
      finalPayable: result.finalPayable,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to apply coupon" });
  }
};

export const getMyCouponClaims = async (req, res) => {
  try {
    const claims = await OfferClaim.find({ userId: req.userId })
      .populate("offerId", "couponCode offerTitle description discountType discountValue startDate endDate")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, claims });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch coupon claims" });
  }
};
