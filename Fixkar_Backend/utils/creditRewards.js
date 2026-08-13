import { Booking } from "../models/bookingModel.js";
import { CreditTransaction } from "../models/creditTransactionModel.js";
import { Wallet } from "../models/walletModel.js";
import { Professional } from "../models/userModel.js";

export const CREDIT_RULES = Object.freeze({ creditsPerRupee: 0.01 });

// Professional achievements are intentionally independent from customer
// coupons. Completing a real booking is the trigger; no coupon claim is
// required. Keep the rules centralized so every completion path uses the same
// milestones and rank calculation.
export const PROFESSIONAL_MILESTONES = Object.freeze([
  Object.freeze({ bookingCount: 1, rewardCredits: 500, rank: "BRONZE", title: "First Booking" }),
  Object.freeze({ bookingCount: 5, rewardCredits: 1000, rank: "SILVER", title: "5 Completed Bookings" }),
  Object.freeze({ bookingCount: 10, rewardCredits: 2000, rank: "DIAMOND", title: "10 Completed Bookings" }),
]);

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
  const professional = await Professional.findById(professionalId)
    .select("userId profession status onBoarded achievements")
    .session(session);

  if (!professional) return { completedBookings, rank, rewards: [] };

  // Only active, onboarded professionals can receive achievement rewards.
  if (professional.status !== "approved" || !professional.onBoarded) {
    await Professional.findByIdAndUpdate(
      professionalId,
      { $set: { "achievements.completedBookings": completedBookings, "achievements.rank": rank, "achievements.rankUpdatedAt": new Date() } },
      { session }
    );
    return { completedBookings, rank, rewards: [] };
  }

  const existingMilestones = new Set((professional.achievements?.unlockedMilestones || []).map(Number));
  const rewards = [];

  // A milestone is rewarded only once. The atomic $addToSet gate makes the
  // operation safe if payment/webhook/completion handling is retried.
  const eligibleMilestones = PROFESSIONAL_MILESTONES.filter(
    (milestone) => milestone.bookingCount <= completedBookings && !existingMilestones.has(milestone.bookingCount)
  );

  for (const milestone of eligibleMilestones) {
    const lockedProfessional = await Professional.findOneAndUpdate(
      {
        _id: professionalId,
        "achievements.unlockedMilestones": { $ne: milestone.bookingCount },
      },
      {
        $addToSet: { "achievements.unlockedMilestones": milestone.bookingCount },
        $set: {
          "achievements.completedBookings": completedBookings,
          "achievements.rank": rank,
          "achievements.rankUpdatedAt": new Date(),
        },
      },
      { new: true, session }
    );

    if (!lockedProfessional) continue;

    const rewardSource = `professional_milestone:${milestone.bookingCount}`;
    const alreadyRewarded = await findCreditTransaction(
      { professionalId, source: rewardSource, referenceId: bookingId, type: "EARNED" },
      session
    );

    if (alreadyRewarded) continue;

    const credits = Number(milestone.rewardCredits);
    await Wallet.findByIdAndUpdate(
      walletId,
      { $inc: { "credits.balance": credits, "credits.lifetimeEarned": credits } },
      { session }
    );

    await CreditTransaction.create([{
      walletId,
      professionalId,
      type: "EARNED",
      source: rewardSource,
      credits,
      referenceId: bookingId,
      referenceModel: "Booking",
      description: `${milestone.title} milestone reward`,
      metadata: {
        milestoneBookings: milestone.bookingCount,
        rank: milestone.rank,
      },
    }], { session });

    existingMilestones.add(milestone.bookingCount);
    rewards.push({
      milestoneBookings: milestone.bookingCount,
      credits,
      rank: milestone.rank,
      title: milestone.title,
    });
  }

  await Professional.findByIdAndUpdate(
    professionalId,
    {
      $set: {
        "achievements.completedBookings": completedBookings,
        "achievements.rank": rank,
        "achievements.rankUpdatedAt": new Date(),
      },
    },
    { session }
  );

  if (completedBookings >= 1) {
    await Wallet.findByIdAndUpdate(
      walletId,
      { $set: { "credits.firstBookingRewarded": true } },
      { session }
    );
  }

  return { completedBookings, rank, rewards };
};

export const rewardCompletedBookingCredits = async ({ booking, walletId, professionalEarnings, session }) => {
  const bookingId = booking._id;
  const professionalId = booking.professionalId._id || booking.professionalId;
  const bookingCredits = Math.floor(Math.max(0, Number(professionalEarnings) || 0) * CREDIT_RULES.creditsPerRupee);

  if (bookingCredits > 0) {
    const existingTransaction = await findCreditTransaction(
      { source: "booking_completion", referenceId: bookingId, type: "EARNED" },
      session
    );

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

      await Wallet.findByIdAndUpdate(
        walletId,
        { $inc: { "credits.balance": bookingCredits, "credits.lifetimeEarned": bookingCredits } },
        session ? { session } : {}
      );
    }
  }

  return rewardProfessionalMilestones({ professionalId, walletId, bookingId, session });
};
