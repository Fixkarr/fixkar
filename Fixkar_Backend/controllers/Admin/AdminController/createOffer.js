import { Offer } from "../AdminModels/offer.model.js";

const normalizeCode = (value) => String(value || "").trim().toUpperCase();
const parseCampaignDate = (value, endOfDay = false) => { const raw = String(value || "").trim(); if (!raw) return null; if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return new Date(`${raw}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+05:30`); const parsed = new Date(raw); return Number.isNaN(parsed.getTime()) ? null : parsed; };

export const createOffer = async (req, res) => {
  try {
    const admin = req.admin; if (!admin) return res.status(401).json({ message: "Unauthorized" });
    const { couponCode, offerTitle, description, audience, benefitType, serviceId = [], discountType, discountValue, minBookingAmount, maxDiscount, rewardType, rewardValue, rewardTrigger, milestones = [], startDate, endDate, usageLimit, perUserLimit = 1, newCustomerOnly = false, isActive = true } = req.body;
    const code = normalizeCode(couponCode); const audiences = Array.isArray(audience) ? audience : [audience].filter(Boolean); const campaignStart = parseCampaignDate(startDate, false); const campaignEnd = parseCampaignDate(endDate, true);
    if (!code || !offerTitle || !campaignStart || !campaignEnd || audiences.length !== 1) return res.status(400).json({ message: "Coupon code, title, one audience and valid dates are required" });
    if (!/^[A-Z0-9_-]{3,30}$/.test(code)) return res.status(400).json({ message: "Invalid coupon code format" }); if (!["customer", "professional"].includes(audiences[0])) return res.status(400).json({ message: "Invalid coupon audience" });

    let normalizedMilestones = [];
    if (benefitType === "CUSTOMER_DISCOUNT") {
      if (audiences[0] !== "customer") return res.status(400).json({ message: "Customer discount coupons are only for customers" }); if (!["percentage", "flat"].includes(discountType)) return res.status(400).json({ message: "Select a valid discount type" });
      if (!Number.isFinite(Number(discountValue)) || Number(discountValue) <= 0) return res.status(400).json({ message: "Discount must be greater than zero" }); if (discountType === "percentage" && Number(discountValue) > 100) return res.status(400).json({ message: "Percentage discount cannot exceed 100" });
      if (discountType === "flat" && maxDiscount != null && maxDiscount !== "") return res.status(400).json({ message: "Max discount is only valid for percentage coupons" });
    } else if (benefitType === "PROFESSIONAL_REWARD") {
      if (audiences[0] !== "professional") return res.status(400).json({ message: "Professional rewards are only for professionals" }); if (rewardType !== "wallet_credits") return res.status(400).json({ message: "Select a valid professional reward type" });
      const trigger = rewardTrigger || "FIRST_COMPLETED_BOOKING";
      if (!["FIRST_COMPLETED_BOOKING", "BOOKING_COUNT_MILESTONE"].includes(trigger)) return res.status(400).json({ message: "Select a valid professional reward trigger" });
      if (trigger === "FIRST_COMPLETED_BOOKING") {
        if (!Number.isFinite(Number(rewardValue)) || Number(rewardValue) < 1) return res.status(400).json({ message: "Professional reward must be at least 1 credit" });
        normalizedMilestones = [{ bookingCount: 1, rewardCredits: Number(rewardValue), badge: "BRONZE", title: "First completed booking" }];
      } else {
        if (!Array.isArray(milestones) || milestones.length === 0) return res.status(400).json({ message: "Add at least one booking milestone" });
        normalizedMilestones = milestones.map((m) => ({ bookingCount: Number(m.bookingCount), rewardCredits: Number(m.rewardCredits), badge: String(m.badge || "BRONZE").toUpperCase(), title: String(m.title || "").trim() }));
        if (normalizedMilestones.some(m => !Number.isInteger(m.bookingCount) || m.bookingCount < 1 || !Number.isFinite(m.rewardCredits) || m.rewardCredits < 1)) return res.status(400).json({ message: "Milestone booking counts and rewards must be positive" });
        normalizedMilestones.sort((a, b) => a.bookingCount - b.bookingCount);
        if (new Set(normalizedMilestones.map(m => m.bookingCount)).size !== normalizedMilestones.length) return res.status(400).json({ message: "Milestone booking counts must be unique" });
        if (!normalizedMilestones.every((m, i) => i === 0 || m.bookingCount > normalizedMilestones[i - 1].bookingCount)) return res.status(400).json({ message: "Milestones must be in increasing order" });
        if (normalizedMilestones.some(m => !["BRONZE", "SILVER", "DIAMOND"].includes(m.badge))) return res.status(400).json({ message: "Invalid milestone badge" });
      }
    } else return res.status(400).json({ message: "Invalid offer benefit type" });

    if (campaignEnd <= campaignStart) return res.status(400).json({ message: "End date must be after start date" });
    if (usageLimit != null && usageLimit !== "" && (!Number.isInteger(Number(usageLimit)) || Number(usageLimit) < 1)) return res.status(400).json({ message: "Usage limit must be a positive integer or empty" });
    if (!Number.isInteger(Number(perUserLimit)) || Number(perUserLimit) < 1) return res.status(400).json({ message: "Per-user limit must be a positive integer" });
    const duplicate = await Offer.findOne({ couponCode: code }); if (duplicate) return res.status(409).json({ message: "Coupon code already exists" });

    const isCustomerDiscount = benefitType === "CUSTOMER_DISCOUNT";
    const newOffer = await Offer.create({ couponCode: code, offerTitle: offerTitle.trim(), description, audience: audiences, benefitType, serviceId: Array.isArray(serviceId) ? serviceId : [], discountType: isCustomerDiscount ? discountType : null, discountValue: isCustomerDiscount ? Number(discountValue) : null, minBookingAmount: isCustomerDiscount && minBookingAmount != null && minBookingAmount !== "" ? Number(minBookingAmount) : null, maxDiscount: isCustomerDiscount && discountType === "percentage" && maxDiscount != null && maxDiscount !== "" ? Number(maxDiscount) : null, rewardType: benefitType === "PROFESSIONAL_REWARD" ? rewardType : null, rewardValue: benefitType === "PROFESSIONAL_REWARD" ? Number((normalizedMilestones[0] || {}).rewardCredits || rewardValue) : null, rewardTrigger: benefitType === "PROFESSIONAL_REWARD" ? (rewardTrigger || "FIRST_COMPLETED_BOOKING") : null, milestones: normalizedMilestones, startDate: campaignStart, endDate: campaignEnd, usageLimit: usageLimit == null || usageLimit === "" ? null : Number(usageLimit), perUserLimit: benefitType === "PROFESSIONAL_REWARD" ? 1 : Number(perUserLimit), newCustomerOnly: isCustomerDiscount ? Boolean(newCustomerOnly) : false, isActive: Boolean(isActive), createdBy: admin._id });
    return res.status(201).json({ message: "Coupon created successfully", offer: newOffer });
  } catch (error) { console.error("CREATE COUPON ERROR:", error); return res.status(400).json({ message: error.message || "Failed to create coupon" }); }
};
