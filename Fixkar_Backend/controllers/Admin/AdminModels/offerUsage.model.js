import mongoose from "mongoose";

const offerUsageSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
  couponCode: { type: String, uppercase: true, trim: true, index: true },
  offerSnapshot: {
    title: { type: String },
    discountType: { type: String, enum: ["percentage", "flat", null], default: null },
    discountValue: { type: Number },
    maxDiscount: { type: Number },
  },
  discountAmount: { type: Number, default: 0, min: 0 },
  rewardCredits: { type: Number, default: 0, min: 0 },
  milestoneTarget: { type: Number, default: null, min: 1 },
  milestoneRank: { type: String, enum: ["BRONZE", "SILVER", "DIAMOND", null], default: null },
  paymentMode: { type: String, enum: ["ONLINE", "CASH", "REWARD"], default: null },
  status: { type: String, enum: ["used", "reversed"], default: "used", index: true },
}, { timestamps: true });

// Customer coupon usage is unique per booking. Professional milestone usage
// is unique per campaign/user/target, so retries cannot grant the same reward twice.
offerUsageSchema.index({ offerId: 1, userId: 1, bookingId: 1, milestoneTarget: 1 }, { unique: true });
offerUsageSchema.index({ offerId: 1, userId: 1, status: 1 });
offerUsageSchema.index({ userId: 1, milestoneTarget: 1, status: 1 });

export const OfferUsage = mongoose.model("OfferUsage", offerUsageSchema);
