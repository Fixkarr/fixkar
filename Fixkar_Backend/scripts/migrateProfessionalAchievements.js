import mongoose from "mongoose";
import dotenv from "dotenv";
import { Professional } from "../models/userModel.js";
import { Booking } from "../models/bookingModel.js";

dotenv.config();

const getRank = (count) => count >= 10 ? "DIAMOND" : count >= 5 ? "SILVER" : count >= 1 ? "BRONZE" : "NEWCOMER";

const run = async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);

  const professionals = await Professional.find({}).select("_id achievements");
  let migrated = 0;

  for (const professional of professionals) {
    const completedBookings = await Booking.countDocuments({ professionalId: professional._id, status: "completed" });
    professional.achievements = {
      ...(professional.achievements?.toObject?.() || professional.achievements || {}),
      completedBookings,
      rank: getRank(completedBookings),
      rankUpdatedAt: new Date(),
      unlockedMilestones: professional.achievements?.unlockedMilestones || [],
      unlockedRewardKeys: professional.achievements?.unlockedRewardKeys || [],
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
