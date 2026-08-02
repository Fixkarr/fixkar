import { Booking } from "../models/bookingModel.js";
import { CreditTransaction } from "../models/creditTransactionModel.js";
import { Wallet } from "../models/walletModel.js";

export const CREDIT_RULES = Object.freeze({
  creditsPerRupee: 0.01,
  firstBookingBonus: 10000,
  creditsPerRupeeValue: 100,
});

const findCreditTransaction = (query, session) => {
  const request = CreditTransaction.findOne(query);
  return session ? request.session(session) : request;
};

const countCompletedBookings = (professionalId, session) => {
  const request = Booking.countDocuments({ professionalId, status: "completed" });
  return session ? request.session(session) : request;
};

export const rewardCompletedBookingCredits = async ({
  booking,
  walletId,
  professionalEarnings,
  session,
}) => {
  const bookingId = booking._id;
  const professionalId = booking.professionalId._id || booking.professionalId;
  const bookingCredits = Math.floor(Math.max(0, Number(professionalEarnings) || 0) * CREDIT_RULES.creditsPerRupee);

  if (bookingCredits > 0) {
    const source = "booking_completion";
    const transactionQuery = { source, referenceId: bookingId, type: "EARNED" };
    const existingTransaction = await findCreditTransaction(transactionQuery, session);

    if (!existingTransaction) {
      try {
        await CreditTransaction.create(
          [{
            walletId,
            professionalId,
            type: "EARNED",
            source,
            credits: bookingCredits,
            referenceId: bookingId,
            referenceModel: "Booking",
            description: "Credits earned for completing a booking",
            metadata: { professionalEarnings: Number(professionalEarnings) || 0 },
          }],
          session ? { session } : {}
        );

        await Wallet.findByIdAndUpdate(
          walletId,
          {
            $inc: {
              "credits.balance": bookingCredits,
              "credits.lifetimeEarned": bookingCredits,
            },
          },
          session ? { session } : {}
        );
      } catch (error) {
        if (error?.code !== 11000) throw error;
      }
    }
  }

  const completedBookings = await countCompletedBookings(professionalId, session);
  if (completedBookings !== 1) return;

  const bonusWallet = await Wallet.findOneAndUpdate(
    { _id: walletId, "credits.firstBookingRewarded": { $ne: true } },
    {
      $set: { "credits.firstBookingRewarded": true },
      $inc: {
        "credits.balance": CREDIT_RULES.firstBookingBonus,
        "credits.lifetimeEarned": CREDIT_RULES.firstBookingBonus,
      },
    },
    { new: true, ...(session ? { session } : {}) }
  );

  if (!bonusWallet) return;

  try {
    await CreditTransaction.create(
      [{
        walletId,
        professionalId,
        type: "EARNED",
        source: "first_booking_bonus",
        credits: CREDIT_RULES.firstBookingBonus,
        referenceId: bookingId,
        referenceModel: "Booking",
        description: "First completed booking bonus",
      }],
      session ? { session } : {}
    );
  } catch (error) {
    if (error?.code !== 11000) throw error;
  }
};
