import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  bookingCount: { type: Number, required: true, min: 1 },
  rewardCredits: { type: Number, required: true, min: 1 },
  badge: { type: String, enum: ["BRONZE", "SILVER", "DIAMOND"], required: true },
  title: { type: String, trim: true, maxlength: 80 },
}, { _id: false });

const offerSchema = new mongoose.Schema({
  couponCode: { type: String, required: true, uppercase: true, trim: true, minlength: 3, maxlength: 30, match: /^[A-Z0-9_-]+$/ },
  offerTitle: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 500 },
  audience: { type: [String], enum: ["customer", "professional"], required: true },
  benefitType: { type: String, enum: ["CUSTOMER_DISCOUNT", "PROFESSIONAL_REWARD"], required: true },
  serviceId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  discountType: { type: String, enum: ["percentage", "flat", null], default: null },
  discountValue: { type: Number, min: 0.01, default: null },
  minBookingAmount: { type: Number, min: 0, default: null },
  maxDiscount: { type: Number, min: 0, default: null },
  rewardType: { type: String, enum: ["wallet_credits", null], default: null },
  rewardValue: { type: Number, min: 1, default: null },
  rewardTrigger: { type: String, enum: ["FIRST_COMPLETED_BOOKING", "BOOKING_COUNT_MILESTONE", null], default: null },
  milestones: { type: [milestoneSchema], default: [] },
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

offerSchema.index({ couponCode: 1 }, { unique: true, sparse: true });
offerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
offerSchema.index({ serviceId: 1, isActive: 1 });

offerSchema.pre("validate", function (next) {
  if (this.couponCode) this.couponCode = this.couponCode.trim().toUpperCase();
  let audience = Array.isArray(this.audience) ? this.audience.filter(Boolean) : [];
  if (audience.length !== 1) {
    if (this.benefitType === "CUSTOMER_DISCOUNT") audience = ["customer"];
    else if (this.benefitType === "PROFESSIONAL_REWARD") audience = ["professional"];
    else return next(new Error("Select exactly one audience for a coupon"));
    this.audience = audience;
  }

  if (this.benefitType === "CUSTOMER_DISCOUNT") {
    if (audience[0] !== "customer") return next(new Error("Customer discount coupons are only for customers"));
    if (!this.discountType || !Number.isFinite(Number(this.discountValue)) || Number(this.discountValue) <= 0) return next(new Error("A valid customer discount is required"));
    if (this.discountType === "percentage" && Number(this.discountValue) > 100) return next(new Error("Percentage discount cannot exceed 100"));
    if (this.discountType === "flat") this.maxDiscount = null;
    this.rewardType = null; this.rewardValue = null; this.rewardTrigger = null; this.milestones = [];
  }

  if (this.benefitType === "PROFESSIONAL_REWARD") {
    if (audience[0] !== "professional") return next(new Error("Professional rewards are only for professionals"));
    if (!this.rewardType) this.rewardType = "wallet_credits";
    const trigger = this.rewardTrigger || "FIRST_COMPLETED_BOOKING";
    this.rewardTrigger = trigger;
    if (!["FIRST_COMPLETED_BOOKING", "BOOKING_COUNT_MILESTONE"].includes(trigger)) return next(new Error("Unsupported professional reward trigger"));

    if (trigger === "FIRST_COMPLETED_BOOKING") {
      const effectiveReward = this.rewardValue ?? this.discountValue;
      if (!Number.isFinite(Number(effectiveReward)) || Number(effectiveReward) < 1) return next(new Error("A professional reward of at least 1 credit is required"));
      this.rewardValue = Number(effectiveReward);
      this.milestones = [{ bookingCount: 1, rewardCredits: Number(effectiveReward), badge: "BRONZE", title: "First Booking" }];
    } else {
      if (!Array.isArray(this.milestones) || this.milestones.length === 0) return next(new Error("At least one booking milestone is required"));
      const sorted = [...this.milestones].sort((a, b) => a.bookingCount - b.bookingCount);
      for (let i = 0; i < sorted.length; i += 1) {
        if (i > 0 && sorted[i].bookingCount <= sorted[i - 1].bookingCount) return next(new Error("Milestone booking counts must be unique and increasing"));
        if (sorted[i].bookingCount < 1 || sorted[i].rewardCredits < 1) return next(new Error("Milestone values must be positive"));
      }
      this.milestones = sorted;
      this.rewardValue = sorted[0].rewardCredits;
    }
    this.discountType = null; this.discountValue = null; this.minBookingAmount = null; this.maxDiscount = null; this.newCustomerOnly = false; this.perUserLimit = 1;
  }

  if (this.usageLimit != null && (!Number.isInteger(Number(this.usageLimit)) || Number(this.usageLimit) < 1)) return next(new Error("Usage limit must be a positive integer or empty"));
  if (!Number.isInteger(Number(this.perUserLimit)) || Number(this.perUserLimit) < 1) return next(new Error("Per-user limit must be a positive integer"));
  if (this.startDate && this.endDate && this.endDate <= this.startDate) return next(new Error("Offer end date must be after start date"));
  next();
});

export const Offer = mongoose.model("Offer", offerSchema);
