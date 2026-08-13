import { Offer } from "../AdminModels/offer.model.js";

const normalizeCode = (value) => String(value || "").trim().toUpperCase();
const parseCampaignDate = (value, endOfDay = false) => {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return new Date(`${raw}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+05:30`);
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const createOffer = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized" });
    const { couponCode, offerTitle, description, audience, benefitType, serviceId = [], discountType, discountValue, minBookingAmount, maxDiscount, startDate, endDate, usageLimit, perUserLimit = 1, newCustomerOnly = false, isActive = true } = req.body;
    const code = normalizeCode(couponCode);
    const audiences = Array.isArray(audience) ? audience : [audience].filter(Boolean);
    const campaignStart = parseCampaignDate(startDate, false);
    const campaignEnd = parseCampaignDate(endDate, true);

    if (!code || !offerTitle || !campaignStart || !campaignEnd || audiences.length !== 1) return res.status(400).json({ message: "Coupon code, title, one audience and valid dates are required" });
    if (audiences[0] !== "customer" || benefitType !== "CUSTOMER_DISCOUNT") return res.status(400).json({ message: "Coupons are available for customer discounts only" });
    if (!/^[A-Z0-9_-]{3,30}$/.test(code)) return res.status(400).json({ message: "Invalid coupon code format" });
    if (!["percentage", "flat"].includes(discountType)) return res.status(400).json({ message: "Select a valid discount type" });
    if (!Number.isFinite(Number(discountValue)) || Number(discountValue) <= 0) return res.status(400).json({ message: "Discount must be greater than zero" });
    if (discountType === "percentage" && Number(discountValue) > 100) return res.status(400).json({ message: "Percentage discount cannot exceed 100" });
    if (discountType === "flat" && maxDiscount != null && maxDiscount !== "") return res.status(400).json({ message: "Max discount is only valid for percentage coupons" });
    if (campaignEnd <= campaignStart) return res.status(400).json({ message: "End date must be after start date" });
    if (usageLimit != null && usageLimit !== "" && (!Number.isInteger(Number(usageLimit)) || Number(usageLimit) < 1)) return res.status(400).json({ message: "Usage limit must be a positive integer or empty" });
    if (!Number.isInteger(Number(perUserLimit)) || Number(perUserLimit) < 1) return res.status(400).json({ message: "Per-user limit must be a positive integer" });

    const duplicate = await Offer.findOne({ couponCode: code });
    if (duplicate) return res.status(409).json({ message: "Coupon code already exists" });

    const newOffer = await Offer.create({
      couponCode: code, offerTitle: offerTitle.trim(), description, audience: ["customer"], benefitType: "CUSTOMER_DISCOUNT",
      serviceId: Array.isArray(serviceId) ? serviceId : [], discountType, discountValue: Number(discountValue),
      minBookingAmount: minBookingAmount != null && minBookingAmount !== "" ? Number(minBookingAmount) : null,
      maxDiscount: discountType === "percentage" && maxDiscount != null && maxDiscount !== "" ? Number(maxDiscount) : null,
      rewardType: null, rewardValue: null, rewardTrigger: null, milestones: [], startDate: campaignStart, endDate: campaignEnd,
      usageLimit: usageLimit == null || usageLimit === "" ? null : Number(usageLimit), perUserLimit: Number(perUserLimit),
      newCustomerOnly: Boolean(newCustomerOnly), isActive: Boolean(isActive), createdBy: admin._id,
    });
    return res.status(201).json({ message: "Customer coupon created successfully", offer: newOffer });
  } catch (error) {
    console.error("CREATE CUSTOMER COUPON ERROR:", error);
    return res.status(400).json({ message: error.message || "Failed to create coupon" });
  }
};
