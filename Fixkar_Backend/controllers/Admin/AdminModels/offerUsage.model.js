import mongoose from "mongoose";

const offerUsageSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  couponCode: { type: String, uppercase: true, trim: true, index: true },
  offerSnapshot: {
    title: { type: String },
    discountType: { type: String, enum: ["percentage", "flat", null], default: null },
    discountValue: { type: Number },
    maxDiscount: { type: Number },
  },
  discountAmount: { type: Number, required: true },
  paymentMode: { type: String, enum: ["ONLINE", "CASH"] },
  status: { type: String, enum: ["used", "reversed"], default: "used", index: true },
}, { timestamps: true });

offerUsageSchema.index({ offerId: 1, userId: 1, bookingId: 1 }, { unique: true });
offerUsageSchema.index({ offerId: 1, userId: 1, status: 1 });

export const OfferUsage = mongoose.model("OfferUsage", offerUsageSchema);
