import { Offer } from "../AdminModels/offer.model.js";
import { OfferClaim } from "../AdminModels/offerClaim.model.js";

const parseCampaignDate = (value, endOfDay = false) => {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return new Date(`${raw}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+05:30`);
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const updateOfferById = async (req, res) => {
  try {
    if (!req.admin) return res.status(401).json({ message: "Unauthorized!" });
    const { offerId } = req.params;
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Coupon not found!" });

    // Professional milestones are no longer coupon campaigns. Existing legacy
    // records remain readable/archivable, but they cannot be edited through
    // the customer coupon editor.
    if (offer.benefitType === "PROFESSIONAL_REWARD" || offer.audience?.[0] === "professional") {
      return res.status(409).json({
        message: "Professional milestone rewards are automatic and are not managed as coupons. This legacy campaign cannot be edited.",
      });
    }

    const { offerTitle, description, audience, benefitType, serviceId, discountType, discountValue, minBookingAmount, maxDiscount, startDate, endDate, usageLimit, perUserLimit, newCustomerOnly, isActive } = req.body;
    const nextAudience = audience === undefined ? offer.audience : (Array.isArray(audience) ? audience : [audience]);
    const nextBenefit = benefitType === undefined ? offer.benefitType : benefitType;

    if (!Array.isArray(nextAudience) || nextAudience.length !== 1 || nextAudience[0] !== "customer") return res.status(400).json({ message: "Coupon updates are for customer campaigns only" });
    if (nextBenefit !== "CUSTOMER_DISCOUNT") return res.status(400).json({ message: "Only customer discount coupons can be updated" });

    const claimCount = await OfferClaim.countDocuments({ offerId: offer._id });
    if (claimCount > 0) {
      const currentServiceIds = (offer.serviceId || []).map(String).sort().join(",");
      const nextServiceIds = (serviceId === undefined ? offer.serviceId || [] : Array.isArray(serviceId) ? serviceId : []).map(String).sort().join(",");
      const serviceChanged = currentServiceIds !== nextServiceIds;
      const discountChanged = (discountType !== undefined && discountType !== offer.discountType) ||
        (discountValue !== undefined && Number(discountValue) !== Number(offer.discountValue)) ||
        (minBookingAmount !== undefined && Number(minBookingAmount || 0) !== Number(offer.minBookingAmount || 0)) ||
        (maxDiscount !== undefined && Number(maxDiscount || 0) !== Number(offer.maxDiscount || 0)) ||
        (newCustomerOnly !== undefined && Boolean(newCustomerOnly) !== Boolean(offer.newCustomerOnly));
      if (serviceChanged || discountChanged) return res.status(409).json({ message: "This campaign already has claims. Financial terms and service targeting cannot be changed. Create a new coupon campaign instead." });
    }

    offer.audience = ["customer"];
    offer.benefitType = "CUSTOMER_DISCOUNT";
    if (offerTitle !== undefined) offer.offerTitle = String(offerTitle).trim();
    if (description !== undefined) offer.description = description;
    if (serviceId !== undefined) offer.serviceId = Array.isArray(serviceId) ? serviceId : [];

    const nextStartDate = startDate === undefined ? offer.startDate : parseCampaignDate(startDate, false);
    const nextEndDate = endDate === undefined ? offer.endDate : parseCampaignDate(endDate, true);
    if (!nextStartDate || !nextEndDate) return res.status(400).json({ message: "Start and end dates are required and must be valid" });
    offer.startDate = nextStartDate;
    offer.endDate = nextEndDate;
    if (usageLimit !== undefined) offer.usageLimit = usageLimit === null || usageLimit === "" ? null : Number(usageLimit);
    if (isActive !== undefined) offer.isActive = Boolean(isActive);

    if (discountType !== undefined) offer.discountType = discountType;
    if (discountValue !== undefined) offer.discountValue = Number(discountValue);
    if (minBookingAmount !== undefined) offer.minBookingAmount = minBookingAmount === null || minBookingAmount === "" ? null : Number(minBookingAmount);
    if (maxDiscount !== undefined) offer.maxDiscount = maxDiscount === null || maxDiscount === "" ? null : Number(maxDiscount);
    if (newCustomerOnly !== undefined) offer.newCustomerOnly = Boolean(newCustomerOnly);

    if (!["percentage", "flat"].includes(offer.discountType)) return res.status(400).json({ message: "Invalid discount type" });
    if (!Number.isFinite(Number(offer.discountValue)) || Number(offer.discountValue) <= 0) return res.status(400).json({ message: "Discount must be greater than zero" });
    if (offer.discountType === "percentage" && Number(offer.discountValue) > 100) return res.status(400).json({ message: "Percentage discount cannot exceed 100" });
    if (offer.discountType === "flat") offer.maxDiscount = null;

    if (perUserLimit !== undefined) offer.perUserLimit = Number(perUserLimit);
    if (offer.usageLimit != null && (!Number.isInteger(offer.usageLimit) || offer.usageLimit < offer.usedCount || offer.usageLimit < 1)) return res.status(400).json({ message: "Usage limit must be an integer greater than or equal to current redemptions" });
    if (!Number.isInteger(Number(offer.perUserLimit)) || Number(offer.perUserLimit) < 1) return res.status(400).json({ message: "Per-user limit must be a positive integer" });
    if (offer.endDate <= offer.startDate) return res.status(400).json({ message: "End date must be after start date" });

    await offer.save();
    return res.status(200).json({ message: "Customer coupon updated successfully", offer });
  } catch (error) {
    console.error("UPDATE CUSTOMER COUPON ERROR:", error);
    return res.status(400).json({ message: error.message || "Failed to update coupon" });
  }
};
