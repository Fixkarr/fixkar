import { Offer } from "../AdminModels/offer.model.js";

export const removeOffer = async (req, res) => {
  try {
    if (!req.admin) return res.status(401).json({ message: "Unauthorized!" });
    const { offerId } = req.params;
    if (!offerId) return res.status(400).json({ message: "Offer ID is required!" });

    const offer = await Offer.findByIdAndUpdate(
      offerId,
      { $set: { isActive: false, archivedAt: new Date() } },
      { new: true }
    );

    if (!offer) return res.status(404).json({ message: "Offer not found!" });
    return res.status(200).json({ message: "Coupon archived successfully!", offer });
  } catch (error) {
    console.error("ARCHIVE COUPON ERROR:", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
