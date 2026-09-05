import mongoose from "mongoose";

import crypto from "crypto";
import { User } from "./models/userModel.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const generateReferralCode = () => {
  return `FXK${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

const generateUniqueReferralCode = async () => {
  while (true) {
    const code = generateReferralCode();

    const exists = await User.exists({
      referralCode: code,
    });

    if (!exists) {
      return code;
    }
  }
};

const migrateReferralCodes = async () => {
  try {
    await mongoose.connect('mongodb+srv://hg852106_db_user:oascqCUAhXedM8zS@fixkar.bk39e3l.mongodb.net/fixkar_db');

    console.log("MongoDB connected");

    // Sirf un users ko find karo jinke paas referralCode nahi hai
    const users = await User.find({
      $or: [
        { referralCode: { $exists: false } },
        { referralCode: null },
        { referralCode: "" },
      ],
    }).select("_id fullName email referralCode");

    console.log(`Users requiring referral code: ${users.length}`);

    let updated = 0;

    for (const user of users) {
      const referralCode = await generateUniqueReferralCode();

      await User.updateOne(
        { _id: user._id },
        { $set: { referralCode } }
      );

      updated++;

      console.log(
        `${updated}/${users.length} → ${user.email} → ${referralCode}`
      );
    }

    console.log("\nMigration completed successfully.");
    console.log(`Total users updated: ${updated}`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

migrateReferralCodes();