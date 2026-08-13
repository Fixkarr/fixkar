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
      benefitType = "CUSTOMER_DISCOUNT",
      serviceId = [],
      discountType,
      discountValue,
      minBookingAmount,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      perUserLimit = 1,
      newCustomerOnly = false,
      isActive = true,
    } = req.body;

    const code = normalizeCode(couponCode);
    const audiences = Array.isArray(audience) ? audience : [audience].filter(Boolean);

    if (!code || !offerTitle || !discountType || discountValue == null || !startDate || !endDate || !audiences.length) {
      return res.status(400).json({ message: "Coupon code, title, audience, discount and validity dates are required" });
    }
    if (!/^[A-Z0-9_-]{3,30}$/.test(code)) return res.status(400).json({ message: "Invalid coupon code format" });
    if (!audiences.every((role) => ["customer", "professional"].includes(role))) return res.status(400).json({ message: "Invalid coupon audience" });
    if (!Number.isFinite(Number(discountValue)) || Number(discountValue) <= 0) return res.status(400).json({ message: "Discount must be greater than zero" });
    if (discountType === "percentage" && Number(discountValue) > 100) return res.status(400).json({ message: "Percentage discount cannot exceed 100" });
    if (discountType === "flat" && Number(maxDiscount || 0) > 0) return res.status(400).json({ message: "Max discount is only valid for percentage coupons" });
    if (new Date(endDate) <= new Date(startDate)) return res.status(400).json({ message: "End date must be after start date" });
    if (usageLimit != null && (!Number.isInteger(Number(usageLimit)) || Number(usageLimit) < 1)) return res.status(400).json({ message: "Usage limit must be a positive integer or empty" });
    if (!Number.isInteger(Number(perUserLimit)) || Number(perUserLimit) < 1) return res.status(400).json({ message: "Per-user limit must be a positive integer" });

    const duplicate = await Offer.findOne({ couponCode: code });
    if (duplicate) return res.status(409).json({ message: "Coupon code already exists" });

    const newOffer = await Offer.create({
      couponCode: code,
      offerTitle: offerTitle.trim(),
      description,
      audience: audiences,
      benefitType,
      serviceId,
      discountType,
      discountValue: Number(discountValue),
      minBookingAmount: minBookingAmount == null ? null : Number(minBookingAmount),
      maxDiscount: discountType === "percentage" && maxDiscount != null ? Number(maxDiscount) : null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      usageLimit: usageLimit == null || usageLimit === "" ? null : Number(usageLimit),
      perUserLimit: Number(perUserLimit),
      newCustomerOnly: Boolean(newCustomerOnly),
      isActive: Boolean(isActive),
      createdBy: admin._id,
    });

    return res.status(201).json({ message: "Coupon created successfully", offer: newOffer });
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);
    return res.status(500).json({ message: "Failed to create coupon" });
  }
};
