import mongoose from "mongoose";
import dotenv from "dotenv";
import { OfferClaim } from "../controllers/Admin/AdminModels/offerClaim.model.js";
import { OfferUsage } from "../controllers/Admin/AdminModels/offerUsage.model.js";
import { Offer } from "../controllers/Admin/AdminModels/offer.model.js";
import { Professional } from "../models/userModel.js";
import { Booking } from "../models/bookingModel.js";

dotenv.config();

const run = async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);

  const claims = await OfferClaim.find({ startingCompletedBookings: { $exists: false } });
  let migrated = 0;

  for (const claim of claims) {
    const offer = await Offer.findById(claim.offerId).select("benefitType");
    if (offer?.benefitType !== "PROFESSIONAL_REWARD") continue;

    const professional = await Professional.findOne({ userId: claim.userId }).select("_id");
    if (!professional) continue;
    const completedBookings = await Booking.countDocuments({ professionalId: professional._id, status: "completed" });
    const legacyReward = await OfferUsage.findOne({ offerId: claim.offerId, userId: claim.userId, bookingId: null, paymentMode: "REWARD", status: "used" });

    claim.startingCompletedBookings = completedBookings;
    claim.rewardedMilestones = legacyReward ? [1] : (claim.rewardedMilestones || []);
    claim.redeemedCount = legacyReward ? Math.max(1, claim.redeemedCount || 0) : (claim.redeemedCount || 0);
    claim.status = legacyReward ? "redeemed" : "claimed";
    await claim.save();
    migrated += 1;
  }

  console.log(`Professional reward claim migration complete. Updated: ${migrated}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Professional reward claim migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
