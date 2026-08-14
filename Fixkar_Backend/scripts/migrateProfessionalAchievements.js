import mongoose from "mongoose";
import dotenv from "dotenv";
import { Professional } from "../models/userModel.js";
import { Booking } from "../models/bookingModel.js";
import { getProfessionalRankProgress } from "../utils/creditRewards.js";

dotenv.config();

const run = async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);

  const professionals = await Professional.find({}).select("_id achievements professionalRank");
  let migrated = 0;

  for (const professional of professionals) {
    const completedBookings = await Booking.countDocuments({
      professionalId: professional._id,
      status: "completed",
    });

    const rank = getProfessionalRankProgress(completedBookings);
    const previousAchievements =
      professional.achievements?.toObject?.() || professional.achievements || {};

    professional.achievements = {
      ...previousAchievements,
      completedBookings,
      rank: rank.tier,
      rankUpdatedAt: new Date(),
      unlockedMilestones: previousAchievements.unlockedMilestones || [],
      unlockedRewardKeys: previousAchievements.unlockedRewardKeys || [],
    };

    professional.professionalRank = {
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

    await professional.save();
    migrated += 1;
  }

  console.log(`Professional achievement migration complete. Updated: ${migrated}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Professional achievement migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
