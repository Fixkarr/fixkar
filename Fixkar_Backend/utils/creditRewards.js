import { Booking } from "../models/bookingModel.js";
import { CreditTransaction } from "../models/creditTransactionModel.js";
import { Wallet } from "../models/walletModel.js";
import { Professional } from "../models/userModel.js";
import { Offer } from "../controllers/Admin/AdminModels/offer.model.js";
import { OfferClaim } from "../controllers/Admin/AdminModels/offerClaim.model.js";
import { OfferUsage } from "../controllers/Admin/AdminModels/offerUsage.model.js";

export const CREDIT_RULES = Object.freeze({ creditsPerRupee: 0.01 });
const findCreditTransaction = (query, session) => { const request = CreditTransaction.findOne(query); return session ? request.session(session) : request; };
const countCompletedBookings = (professionalId, session) => { const request = Booking.countDocuments({ professionalId, status: "completed" }); return session ? request.session(session) : request; };
const getRankForBookings = (completedBookings) => completedBookings >= 10 ? "DIAMOND" : completedBookings >= 5 ? "SILVER" : completedBookings >= 1 ? "BRONZE" : "BRONZE";

export const rewardProfessionalMilestones = async ({ professionalId, walletId, bookingId, session }) => {
  const completedBookings = await countCompletedBookings(professionalId, session);
  const rank = getRankForBookings(completedBookings);
  const professional = await Professional.findById(professionalId).select("userId profession achievements").session(session);
  if (!professional) return { completedBookings, rank, rewards: [] };
  const rankOrder = { BRONZE: 1, SILVER: 2, DIAMOND: 3 };
  const currentRank = professional.achievements?.rank || "BRONZE";
  const finalRank = (rankOrder[rank] || 1) >= (rankOrder[currentRank] || 1) ? rank : currentRank;
  const existingKeys = new Set(professional.achievements?.unlockedRewardKeys || []);
  const existingMilestones = new Set(professional.achievements?.unlockedMilestones || []);

  const claims = await OfferClaim.find({ userId: professional.userId, status: { $in: ["claimed", "redeemed"]] }).populate({ path: "offerId", match: { benefitType: "PROFESSIONAL_REWARD", rewardTrigger: { $in: ["FIRST_COMPLETED_BOOKING", "BOOKING_COUNT_MILESTONE"] }, isActive: true } }).session(session);
  const rewards = [];

  for (const claim of claims) {
    const offer = claim.offerId;
    if (!offer || offer.archivedAt || new Date() < offer.startDate || new Date() > offer.endDate) continue;
    if (offer.serviceId?.length && (!professional.profession || !offer.serviceId.some(id => id.toString() === professional.profession.toString()))) continue;
    const milestones = Array.isArray(offer.milestones) && offer.milestones.length ? offer.milestones : [{ bookingCount: 1, rewardCredits: Number(offer.rewardValue || 0), badge: "BRONZE", title: "First completed booking" }];
    const eligible = milestones.filter(m => Number(m.bookingCount) <= completedBookings && Number(m.rewardCredits) > 0).sort((a, b) => Number(a.bookingCount) - Number(b.bookingCount));

    for (const milestone of eligible) {
      const target = Number(milestone.bookingCount); const rewardKey = `${offer._id}:${target}`;
      if (existingKeys.has(rewardKey)) continue;
      const lockedClaim = await OfferClaim.findOneAndUpdate({ _id: claim._id, rewardedMilestones: { $ne: target }, status: { $in: ["claimed", "redeemed"] } }, { $addToSet: { rewardedMilestones: target }, $set: { status: "redeemed", redeemedAt: new Date() }, $inc: { redeemedCount: 1 } }, { new: true, session });
      if (!lockedClaim) continue;
      const credits = Number(milestone.rewardCredits);
      const rewardSource = `professional_milestone:${offer._id}:${target}`;
      const alreadyRewarded = await findCreditTransaction({ source: rewardSource, referenceId: bookingId, type: "EARNED" }, session);
      if (alreadyRewarded) { existingKeys.add(rewardKey); existingMilestones.add(target); continue; }
      await Wallet.findByIdAndUpdate(walletId, { $inc: { "credits.balance": credits, "credits.lifetimeEarned": credits } }, { session });
      await CreditTransaction.create([{ walletId, professionalId, type: "EARNED", source: rewardSource, credits, referenceId: bookingId, referenceModel: "Booking", description: `${offer.offerTitle} - ${milestone.title || `${target} completed bookings`} reward`, metadata: { offerId: offer._id, couponCode: offer.couponCode, targetBookings: target, rank: milestone.badge } }], { session });
      await OfferUsage.create([{ offerId: offer._id, userId: professional.userId, bookingId, couponCode: offer.couponCode, rewardCredits: credits, milestoneTarget: target, milestoneRank: milestone.badge, paymentMode: "REWARD", status: "used", offerSnapshot: { title: offer.offerTitle } }], { session });
      existingKeys.add(rewardKey); existingMilestones.add(target); rewards.push({ offerId: offer._id, couponCode: offer.couponCode, targetBookings: target, credits, rank: milestone.badge });
    }
  }

  await Professional.findByIdAndUpdate(professionalId, { $set: { "achievements.completedBookings": completedBookings, "achievements.rank": finalRank, "achievements.rankUpdatedAt": new Date(), "achievements.unlockedMilestones": [...existingMilestones], "achievements.unlockedRewardKeys": [...existingKeys] } }, { session });
  if (completedBookings >= 1) await Wallet.findByIdAndUpdate(walletId, { $set: { "credits.firstBookingRewarded": true } }, { session });
  return { completedBookings, rank: finalRank, rewards };
};

export const rewardCompletedBookingCredits = async ({ booking, walletId, professionalEarnings, session }) => {
  const bookingId = booking._id; const professionalId = booking.professionalId._id || booking.professionalId;
  const bookingCredits = Math.floor(Math.max(0, Number(professionalEarnings) || 0) * CREDIT_RULES.creditsPerRupee);
  if (bookingCredits > 0) {
    const existingTransaction = await findCreditTransaction({ source: "booking_completion", referenceId: bookingId, type: "EARNED" }, session);
    if (!existingTransaction) {
      await CreditTransaction.create([{ walletId, professionalId, type: "EARNED", source: "booking_completion", credits: bookingCredits, referenceId: bookingId, referenceModel: "Booking", description: "Credits earned for completing a booking", metadata: { professionalEarnings: Number(professionalEarnings) || 0 } }], session ? { session } : {});
      await Wallet.findByIdAndUpdate(walletId, { $inc: { "credits.balance": bookingCredits, "credits.lifetimeEarned": bookingCredits } }, session ? { session } : {});
    }
  }
  return rewardProfessionalMilestones({ professionalId, walletId, bookingId, session });
};
