import { Offer } from "../AdminModels/offer.model.js";

export const updateOfferById = async (req, res) => {
  try {
    if (!req.admin) return res.status(401).json({ message: "Unauthorized!" });

    const { offerId } = req.params;
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: "Coupon not found!" });

    const { offerTitle, description, audience, benefitType, serviceId, discountType, discountValue, minBookingAmount, maxDiscount, startDate, endDate, usageLimit, perUserLimit, newCustomerOnly, isActive } = req.body;

    // Coupon code is immutable so historical claims and bookings remain auditable.
    if (offerTitle !== undefined) offer.offerTitle = String(offerTitle).trim();
    if (description !== undefined) offer.description = description;
    if (audience !== undefined) offer.audience = Array.isArray(audience) ? audience : [audience];
    if (benefitType !== undefined) offer.benefitType = benefitType;
    if (serviceId !== undefined) offer.serviceId = serviceId;
    if (discountType !== undefined) offer.discountType = discountType;
    if (discountValue !== undefined) offer.discountValue = Number(discountValue);
    if (minBookingAmount !== undefined) offer.minBookingAmount = minBookingAmount === null || minBookingAmount === "" ? null : Number(minBookingAmount);
    if (maxDiscount !== undefined) offer.maxDiscount = maxDiscount === null || maxDiscount === "" ? null : Number(maxDiscount);
    if (startDate !== undefined) offer.startDate = new Date(startDate);
    if (endDate !== undefined) offer.endDate = new Date(endDate);
    if (usageLimit !== undefined) offer.usageLimit = usageLimit === null || usageLimit === "" ? null : Number(usageLimit);
    if (perUserLimit !== undefined) offer.perUserLimit = Number(perUserLimit);
    if (newCustomerOnly !== undefined) offer.newCustomerOnly = Boolean(newCustomerOnly);
    if (isActive !== undefined) offer.isActive = Boolean(isActive);

    if (offer.discountType === "percentage" && (offer.discountValue <= 0 || offer.discountValue > 100)) return res.status(400).json({ message: "Percentage discount must be between 0 and 100" });
    if (offer.discountType === "flat" && offer.discountValue <= 0) return res.status(400).json({ message: "Flat discount must be greater than zero" });
    if (offer.endDate <= offer.startDate) return res.status(400).json({ message: "End date must be after start date" });
    if (!Array.isArray(offer.audience) || !offer.audience.length || !offer.audience.every((r) => ["customer", "professional"].includes(r))) return res.status(400).json({ message: "Invalid coupon audience" });

    await offer.save();
    return res.status(200).json({ message: "Coupon updated successfully", offer });
  } catch (error) {
    console.error("UPDATE COUPON ERROR:", error);
    return res.status(500).json({ message: "Failed to update coupon" });
  }
};
