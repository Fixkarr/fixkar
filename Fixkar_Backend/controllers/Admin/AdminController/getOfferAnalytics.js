import { Offer } from "../AdminModels/offer.model.js";
import { OfferClaim } from "../AdminModels/offerClaim.model.js";
import { OfferUsage } from "../AdminModels/offerUsage.model.js";

export const getOfferAnalytics = async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await Offer.findById(offerId).populate("serviceId", "name");
    if (!offer) return res.status(404).json({ message: "Coupon not found" });

    const [claims, redemptions, discountAgg] = await Promise.all([
      OfferClaim.countDocuments({ offerId }),
      OfferUsage.countDocuments({ offerId, status: "used" }),
      OfferUsage.aggregate([
        { $match: { offerId: offer._id, status: "used" } },
        { $group: { _id: null, totalDiscount: { $sum: "$discountAmount" } } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        offer,
        claims,
        redemptions,
        totalDiscount: discountAgg[0]?.totalDiscount || 0,
        remainingUsage: offer.usageLimit == null ? null : Math.max(0, offer.usageLimit - redemptions),
      },
    });
  } catch (error) {
    console.error("COUPON ANALYTICS ERROR:", error);
    return res.status(500).json({ message: "Failed to load coupon analytics" });
  }
};
