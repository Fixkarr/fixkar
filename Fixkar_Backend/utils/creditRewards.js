import { Booking } from "../models/bookingModel.js";
import { CreditTransaction } from "../models/creditTransactionModel.js";
import { Wallet } from "../models/walletModel.js";
import { Professional } from "../models/userModel.js";
import { Offer } from "../controllers/Admin/AdminModels/offer.model.js";
import { OfferClaim } from "../controllers/Admin/AdminModels/offerClaim.model.js";
import { OfferUsage } from "../controllers/Admin/AdminModels/offerUsage.model.js";

export const CREDIT_RULES = Object.freeze({
  creditsPerRupee: 0.01,
});

const findCreditTransaction = (query, session) => {
  const request = CreditTransaction.findOne(query);
  return session ? request.session(session) : request;
};

const countCompletedBookings = (professionalId, session) => {
  const request = Booking.countDocuments({ professionalId, status: "completed" });
  return session ? request.session(session) : request;
};

const getRankForBookings = (completedBookings) => {
  if (completedBookings >= 10) return "DIAMOND";
  if (completedBookings >= 5) return "SILVER";
  if (completedBookings >= 1) return "BRONZE";
  return "NEWCOMER";
};

export const rewardProfessionalMilestones = async ({ professionalId, walletId, bookingId, session }) => {
  const completedBookings = await countCompletedBookings(professionalId, session);
  const rank = getRankForBookings(completedBookings);

  // Rank is derived from verified completed bookings, never from the frontend.
  await Professional.findOneAndUpdate(
    { _id: professionalId },
    { $set: { "achievements.completedBookings": completedBookings, "achievements.rank": rank, "achievements.rankUpdatedAt": new Date() } },
    { session }
  );

  const user = await Professional.findById(professionalId).select("userId").session(session);
  if (!user) return { completedBookings, rank, rewards: [] };

  const claims = await OfferClaim.find({ userId: user.userId, status: { $in: ["claimed", "redeemed"] } })
    .populate({ path: "offerId", match: { benefitType: "PROFESSIONAL_REWARD", rewardTrigger: "FIRST_COMPLETED_BOOKING", isActive: true } })
    .session(session);

  const rewards = [];
  for (const claim of claims) {
    const offer = claim.offerId;
    if (!offer || offer.archivedAt || new Date() < offer.startDate || new Date() > offer.endDate) continue;

    // A service-scoped professional campaign only applies to professionals in
    // the selected service. The professional service is read once per claim.
    if (offer.serviceId?.length) {
      const professional = await Professional.findById(professionalId).select("profession").session(session);
      if (!professional?.profession || !offer.serviceId.some(id => id.toString() === professional.profession.toString())) continue;
    }

    const milestones = Array.isArray(offer.milestones) && offer.milestones.length
      ? offer.milestones
      : [{ targetBookings: 1, rewardCredits: Number(offer.rewardValue || 0), rank: "BRONZE", label: "First completed booking" }];

    const eligible = milestones
      .filter(m => Number(m.targetBookings) <= completedBookings && Number(m.rewardCredits) > 0)
      .sort((a, b) => Number(a.targetBookings) - Number(b.targetBookings));

    for (const milestone of eligible) {
      const target = Number(milestone.targetBookings);
      if (claim.rewardedMilestones?.includes(target)) continue;

      // Claim update is the idempotency gate. MongoDB single-document writes
      // are atomic when the expected state is part of the filter.
      const lockedClaim = await OfferClaim.findOneAndUpdate(
        { _id: claim._id, rewardedMilestones: { $ne: target }, status: { $in: ["claimed", "redeemed"] } },
        { $addToSet: { rewardedMilestones: target }, $set: { status: "redeemed", redeemedAt: new Date() }, $inc: { redeemedCount: 1 } },
        { new: true, session }
      );
      if (!lockedClaim) continue;

      const credits = Number(milestone.rewardCredits);
      await Wallet.findByIdAndUpdate(walletId, { $inc: { "credits.balance": credits, "credits.lifetimeEarned": credits } }, { session });

      await CreditTransaction.create([{
        walletId,
        professionalId,
        type: "EARNED",
        source: "professional_milestone",
        credits,
        referenceId: bookingId,
        referenceModel: "Booking",
        description: `${offer.offerTitle} - ${milestone.label || `${target} completed bookings`} reward`,
        metadata: { offerId: offer._id, couponCode: offer.couponCode, targetBookings: target, rank: milestone.rank || rank },
      }], { session });

      await OfferUsage.create([{
        offerId: offer._id,
        userId: user.userId,
        bookingId,
        couponCode: offer.couponCode,
        rewardCredits: credits,
        milestoneTarget: target,
        milestoneRank: milestone.rank || rank,
        paymentMode: "REWARD",
        status: "used",
      }], { session });

      rewards.push({ offerId: offer._id, couponCode: offer.couponCode, targetBookings: target, credits, rank: milestone.rank || rank });
    }
  }

  // Keep the legacy first-booking flag synchronized for existing consumers;
  // the milestone ledger above remains the source of truth.
  if (completedBookings >= 1) {
    await Wallet.findByIdAndUpdate(walletId, { $set: { "credits.firstBookingRewarded": true } }, { session });
  }

  return { completedBookings, rank, rewards };
};

export const rewardCompletedBookingCredits = async ({ booking, walletId, professionalEarnings, session }) => {
  const bookingId = booking._id;
  const professionalId = booking.professionalId._id || booking.professionalId;
  const bookingCredits = Math.floor(Math.max(0, Number(professionalEarnings) || 0) * CREDIT_RULES.creditsPerRupee);

  if (bookingCredits > 0) {
    const existingTransaction = await findCreditTransaction({ source: "booking_completion", referenceId: bookingId, type: "EARNED" }, session);
    if (!existingTransaction) {
      await CreditTransaction.create([{
        walletId,
        professionalId,
        type: "EARNED",
        source: "booking_completion",
        credits: bookingCredits,
        referenceId: bookingId,
        referenceModel: "Booking",
        description: "Credits earned for completing a booking",
        metadata: { professionalEarnings: Number(professionalEarnings) || 0 },
      }], session ? { session } : {});
      await Wallet.findByIdAndUpdate(walletId, { $inc: { "credits.balance": bookingCredits, "credits.lifetimeEarned": bookingCredits } }, session ? { session } : {});
    }
  }

  return rewardProfessionalMilestones({ professionalId, walletId, bookingId, session });
};
