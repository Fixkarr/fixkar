import { Booking } from "../models/bookingModel.js";
import { CreditTransaction } from "../models/creditTransactionModel.js";
import { Wallet } from "../models/walletModel.js";
import { Professional } from "../models/userModel.js";

export const CREDIT_RULES = Object.freeze({ creditsPerRupee: 0.01 });

// Bronze 1 at zero bookings is retained as the internal starting milestone for
// backwards compatibility. The user-facing rank at zero bookings is NEWCOMER.
export const PROFESSIONAL_RANKS = Object.freeze([
  Object.freeze({ tier: "BRONZE", level: 1, requiredBookings: 0, credits: 0 }),
  Object.freeze({ tier: "BRONZE", level: 2, requiredBookings: 1, credits: 10000 }),
  Object.freeze({ tier: "BRONZE", level: 3, requiredBookings: 3, credits: 50 }),
  Object.freeze({ tier: "BRONZE", level: 4, requiredBookings: 6, credits: 75 }),
  Object.freeze({ tier: "BRONZE", level: 5, requiredBookings: 10, credits: 100 }),
  Object.freeze({ tier: "SILVER", level: 1, requiredBookings: 15, credits: 150 }),
  Object.freeze({ tier: "SILVER", level: 2, requiredBookings: 20, credits: 175 }),
  Object.freeze({ tier: "SILVER", level: 3, requiredBookings: 25, credits: 200 }),
  Object.freeze({ tier: "SILVER", level: 4, requiredBookings: 30, credits: 225 }),
  Object.freeze({ tier: "SILVER", level: 5, requiredBookings: 35, credits: 250 }),
  Object.freeze({ tier: "GOLD", level: 1, requiredBookings: 40, credits: 300 }),
  Object.freeze({ tier: "GOLD", level: 2, requiredBookings: 45, credits: 325 }),
  Object.freeze({ tier: "GOLD", level: 3, requiredBookings: 50, credits: 350 }),
  Object.freeze({ tier: "GOLD", level: 4, requiredBookings: 55, credits: 375 }),
  Object.freeze({ tier: "GOLD", level: 5, requiredBookings: 60, credits: 400 }),
  Object.freeze({ tier: "PLATINUM", level: 1, requiredBookings: 65, credits: 450 }),
  Object.freeze({ tier: "PLATINUM", level: 2, requiredBookings: 70, credits: 475 }),
  Object.freeze({ tier: "PLATINUM", level: 3, requiredBookings: 75, credits: 500 }),
  Object.freeze({ tier: "PLATINUM", level: 4, requiredBookings: 80, credits: 525 }),
  Object.freeze({ tier: "PLATINUM", level: 5, requiredBookings: 85, credits: 550 }),
  Object.freeze({ tier: "DIAMOND", level: 1, requiredBookings: 90, credits: 600 }),
  Object.freeze({ tier: "DIAMOND", level: 2, requiredBookings: 95, credits: 625 }),
  Object.freeze({ tier: "DIAMOND", level: 3, requiredBookings: 100, credits: 650 }),
  Object.freeze({ tier: "DIAMOND", level: 4, requiredBookings: 105, credits: 675 }),
  Object.freeze({ tier: "DIAMOND", level: 5, requiredBookings: 110, credits: 700 }),
]);

const NEWCOMER_RANK = Object.freeze({ tier: "NEWCOMER", level: 1, requiredBookings: 0, credits: 0 });

const findCreditTransaction = (query, session) => {
  const request = CreditTransaction.findOne(query);
  return session ? request.session(session) : request;
};

const countCompletedBookings = (professionalId, session) => {
  const request = Booking.countDocuments({ professionalId, status: "completed" });
  return session ? request.session(session) : request;
};

export const getProfessionalRankForBookings = (completedBookings) => {
  const count = Math.max(0, Number(completedBookings) || 0);
  if (count === 0) return NEWCOMER_RANK;

  let current = PROFESSIONAL_RANKS[1];
  for (const rank of PROFESSIONAL_RANKS.slice(1)) {
    if (count >= rank.requiredBookings) current = rank;
    else break;
  }
  return current;
};

export const getProfessionalRankProgress = (completedBookings) => {
  const count = Math.max(0, Number(completedBookings) || 0);

  if (count === 0) {
    const firstMilestone = PROFESSIONAL_RANKS[1];
    return {
      ...NEWCOMER_RANK,
      score: 0,
      nextTier: firstMilestone.tier,
      nextLevel: firstMilestone.level,
      nextRequiredBookings: firstMilestone.requiredBookings,
      nextRewardCredits: firstMilestone.credits,
      bookingsRemaining: firstMilestone.requiredBookings,
    };
  }

  const current = getProfessionalRankForBookings(count);
  const index = PROFESSIONAL_RANKS.findIndex(
    (item) => item.tier === current.tier && item.level === current.level
  );
  const next = PROFESSIONAL_RANKS[index + 1] || null;

  return {
    ...current,
    score: count,
    nextTier: next?.tier || null,
    nextLevel: next?.level || null,
    nextRequiredBookings: next?.requiredBookings ?? null,
    nextRewardCredits: next?.credits ?? 0,
    bookingsRemaining: next ? Math.max(0, next.requiredBookings - count) : 0,
  };
};

export const rewardProfessionalMilestones = async ({ professionalId, walletId, bookingId, session }) => {
  const completedBookings = await countCompletedBookings(professionalId, session);
  const rank = getProfessionalRankProgress(completedBookings);
  const professional = await Professional.findById(professionalId)
    .select("userId profession status onBoarded achievements professionalRank")
    .session(session);

  if (!professional) return { completedBookings, rank, rewards: [] };

  const rankSnapshot = {
    tier: rank.tier,
    level: rank.level,
    score: rank.score,
    completedBookings,
    milestoneBookings: rank.requiredBookings,
    nextMilestoneBookings: rank.nextRequiredBookings ?? 0,
    nextTier: rank.nextTier ?? null,
    nextLevel: rank.nextLevel ?? null,
    nextRewardCredits: rank.nextRewardCredits ?? 0,
    updatedAt: new Date(),
  };

  if (professional.status !== "approved" || !professional.onBoarded) {
    await Professional.findByIdAndUpdate(professionalId, {
      $set: {
        "achievements.completedBookings": completedBookings,
        "achievements.rank": rank.tier,
        "achievements.rankUpdatedAt": new Date(),
        professionalRank: rankSnapshot,
      },
    }, { session });
    return { completedBookings, rank, rewards: [] };
  }

  const currentIndex = rank.tier === "NEWCOMER"
    ? 0
    : PROFESSIONAL_RANKS.findIndex((item) => item.tier === rank.tier && item.level === rank.level);
  const previousMilestones = new Set((professional.achievements?.unlockedMilestones || []).map(Number));
  const rewards = [];

  for (let index = 1; index <= currentIndex; index += 1) {
    const milestone = PROFESSIONAL_RANKS[index];
    if (previousMilestones.has(milestone.requiredBookings)) continue;

    const lockedProfessional = await Professional.findOneAndUpdate(
      { _id: professionalId, "achievements.unlockedMilestones": { $ne: milestone.requiredBookings } },
      {
        $addToSet: { "achievements.unlockedMilestones": milestone.requiredBookings },
        $set: {
          "achievements.completedBookings": completedBookings,
          "achievements.rank": rank.tier,
          "achievements.rankUpdatedAt": new Date(),
          professionalRank: rankSnapshot,
        },
      },
      { new: true, session }
    );
    if (!lockedProfessional) continue;

    const rewardSource = `professional_rank:${milestone.tier}:${milestone.level}`;
    const alreadyRewarded = await findCreditTransaction({ professionalId, source: rewardSource, type: "EARNED" }, session);
    if (!alreadyRewarded && milestone.credits > 0) {
      await Wallet.findByIdAndUpdate(walletId, { $inc: { "credits.balance": milestone.credits, "credits.lifetimeEarned": milestone.credits } }, { session });
      await CreditTransaction.create([{
        walletId,
        professionalId,
        type: "EARNED",
        source: rewardSource,
        credits: milestone.credits,
        referenceId: bookingId,
        referenceModel: "Booking",
        description: `${milestone.tier} ${milestone.level} rank reward`,
        metadata: { tier: milestone.tier, level: milestone.level, requiredBookings: milestone.requiredBookings },
      }], { session });
      rewards.push({ tier: milestone.tier, level: milestone.level, credits: milestone.credits, requiredBookings: milestone.requiredBookings });
    }
  }

  await Professional.findByIdAndUpdate(professionalId, {
    $set: {
      "achievements.completedBookings": completedBookings,
      "achievements.rank": rank.tier,
      "achievements.rankUpdatedAt": new Date(),
      professionalRank: rankSnapshot,
    },
  }, { session });

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
        walletId, professionalId, type: "EARNED", source: "booking_completion", credits: bookingCredits,
        referenceId: bookingId, referenceModel: "Booking", description: "Credits earned for completing a booking",
        metadata: { professionalEarnings: Number(professionalEarnings) || 0 },
      }], session ? { session } : {});
      await Wallet.findByIdAndUpdate(walletId, { $inc: { "credits.balance": bookingCredits, "credits.lifetimeEarned": bookingCredits } }, session ? { session } : {});
    }
  }

  return rewardProfessionalMilestones({ professionalId, walletId, bookingId, session });
};
