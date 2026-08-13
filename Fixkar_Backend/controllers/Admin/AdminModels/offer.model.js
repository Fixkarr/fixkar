import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  couponCode: { type: String, required: true, uppercase: true, trim: true, minlength: 3, maxlength: 30, match: /^[A-Z0-9_-]+$/ },
  offerTitle: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 500 },
  audience: { type: [String], enum: ["customer", "professional"], required: true, validate: { validator: (value) => Array.isArray(value) && value.length > 0, message: "At least one audience is required" } },
  benefitType: { type: String, enum: ["CUSTOMER_DISCOUNT", "PROFESSIONAL_REWARD"], default: "CUSTOMER_DISCOUNT" },
  serviceId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  discountType: { type: String, enum: ["percentage", "flat"], required: true },
  discountValue: { type: Number, required: true, min: 0.01 },
  minBookingAmount: { type: Number, min: 0 },
  maxDiscount: { type: Number, min: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number, min: 1, default: null },
  usedCount: { type: Number, default: 0, min: 0 },
  perUserLimit: { type: Number, min: 1, default: 1 },
  newCustomerOnly: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  archivedAt: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
}, { timestamps: true });

// Sparse is intentional for the one-time legacy migration: old offer documents
// may not have a couponCode yet. The migration fills every legacy document.
offerSchema.index({ couponCode: 1 }, { unique: true, sparse: true });
offerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
offerSchema.index({ serviceId: 1, isActive: 1 });

offerSchema.pre("validate", function (next) {
  if (this.couponCode) this.couponCode = this.couponCode.trim().toUpperCase();
  next();
});

offerSchema.pre("save", function (next) {
  if (this.discountType === "percentage" && this.discountValue > 100) return next(new Error("Percentage discount cannot exceed 100"));
  if (this.discountType === "flat" && this.maxDiscount != null) this.maxDiscount = null;
  if (this.startDate && this.endDate && this.endDate <= this.startDate) return next(new Error("Offer end date must be after start date"));
  next();
});

export const Offer = mongoose.model("Offer", offerSchema);
