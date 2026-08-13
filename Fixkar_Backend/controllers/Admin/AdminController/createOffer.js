import { Offer } from "../AdminModels/offer.model.js";

const normalizeCode = (value) => String(value || "").trim().toUpperCase();

export const createOffer = async (req, res) => {
  try {
    const admin = req.admin;
    if (!admin) return res.status(401).json({ message: "Unauthorized" });

    const {
      couponCode,
      offerTitle,
      description,
      audience,
      benefitType,
      serviceId = [],
      discountType,
      discountValue,
      minBookingAmount,
      maxDiscount,
      rewardType,
      rewardValue,
      startDate,
      endDate,
      usageLimit,
      perUserLimit = 1,
      newCustomerOnly = false,
      isActive = true,
    } = req.body;

    const code = normalizeCode(couponCode);
    const audiences = Array.isArray(audience) ? audience : [audience].filter(Boolean);

    if (!code || !offerTitle || !startDate || !endDate || audiences.length !== 1) {
      return res.status(400).json({ message: "Coupon code, title, one audience and validity dates are required" });
    }
    if (!/^[A-Z0-9_-]{3,30}$/.test(code)) return res.status(400).json({ message: "Invalid coupon code format" });
    if (!["customer", "professional"].includes(audiences[0])) return res.status(400).json({ message: "Invalid coupon audience" });

    if (benefitType === "CUSTOMER_DISCOUNT") {
      if (audiences[0] !== "customer") return res.status(400).json({ message: "Customer discount coupons are only for customers" });
      if (!["percentage", "flat"].includes(discountType)) return res.status(400).json({ message: "Select a valid discount type" });
      if (!Number.isFinite(Number(discountValue)) || Number(discountValue) <= 0) return res.status(400).json({ message: "Discount must be greater than zero" });
      if (discountType === "percentage" && Number(discountValue) > 100) return res.status(400).json({ message: "Percentage discount cannot exceed 100" });
      if (discountType === "flat" && maxDiscount != null && maxDiscount !== "") return res.status(400).json({ message: "Max discount is only valid for percentage coupons" });
      if (newCustomerOnly && audiences[0] !== "customer") return res.status(400).json({ message: "New customer restriction is only for customer coupons" });
    } else if (benefitType === "PROFESSIONAL_REWARD") {
      if (audiences[0] !== "professional") return res.status(400).json({ message: "Professional rewards are only for professionals" });
      if (rewardType !== "wallet_credits") return res.status(400).json({ message: "Select a valid professional reward type" });
      if (!Number.isFinite(Number(rewardValue)) || Number(rewardValue) < 1) return res.status(400).json({ message: "Professional reward must be at least 1 credit" });
    } else {
      return res.status(400).json({ message: "Invalid offer benefit type" });
    }

    if (new Date(endDate) <= new Date(startDate)) return res.status(400).json({ message: "End date must be after start date" });
    if (usageLimit != null && usageLimit !== "" && (!Number.isInteger(Number(usageLimit)) || Number(usageLimit) < 1)) return res.status(400).json({ message: "Usage limit must be a positive integer or empty" });
    if (!Number.isInteger(Number(perUserLimit)) || Number(perUserLimit) < 1) return res.status(400).json({ message: "Per-user limit must be a positive integer" });

    const duplicate = await Offer.findOne({ couponCode: code });
    if (duplicate) return res.status(409).json({ message: "Coupon code already exists" });

    const isCustomerDiscount = benefitType === "CUSTOMER_DISCOUNT";

    const newOffer = await Offer.create({
      couponCode: code,
      offerTitle: offerTitle.trim(),
      description,
      audience: audiences,
      benefitType,
      serviceId: Array.isArray(serviceId) ? serviceId : [],
      discountType: isCustomerDiscount ? discountType : null,
      discountValue: isCustomerDiscount ? Number(discountValue) : null,
      minBookingAmount: isCustomerDiscount && minBookingAmount != null && minBookingAmount !== "" ? Number(minBookingAmount) : null,
      maxDiscount: isCustomerDiscount && discountType === "percentage" && maxDiscount != null && maxDiscount !== "" ? Number(maxDiscount) : null,
      rewardType: benefitType === "PROFESSIONAL_REWARD" ? rewardType : null,
      rewardValue: benefitType === "PROFESSIONAL_REWARD" ? Number(rewardValue) : null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      usageLimit: usageLimit == null || usageLimit === "" ? null : Number(usageLimit),
      perUserLimit: benefitType === "PROFESSIONAL_REWARD" ? 1 : Number(perUserLimit),
      newCustomerOnly: isCustomerDiscount ? Boolean(newCustomerOnly) : false,
      isActive: Boolean(isActive),
      createdBy: admin._id,
    });

    return res.status(201).json({ message: "Coupon created successfully", offer: newOffer });
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);
    return res.status(400).json({ message: error.message || "Failed to create coupon" });
  }
};
