import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import { Offer } from "../controllers/Admin/AdminModels/offer.model.js";

dotenv.config();

const makeCode = (title) => {
  const prefix = String(title || "FIXKAR").replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 8) || "FIXKAR";
  return `${prefix}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
};

const run = async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);

  const offers = await Offer.find({ couponCode: { $exists: false } });
  let migrated = 0;

  for (const offer of offers) {
    let couponCode = makeCode(offer.offerTitle);
    while (await Offer.exists({ couponCode })) couponCode = makeCode(offer.offerTitle);

    offer.couponCode = couponCode;
    offer.description = offer.description || offer.offerTitle;
    offer.audience = ["customer"];
    offer.benefitType = "CUSTOMER_DISCOUNT";
    offer.startDate = offer.startDate || new Date();
    offer.endDate = offer.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    offer.perUserLimit = offer.perUserLimit || 1;
    offer.isActive = offer.isActive !== false;
    await offer.save();
    migrated += 1;
    console.log(`Migrated ${offer._id} -> ${couponCode}`);
  }

  console.log(`Coupon migration complete. Migrated: ${migrated}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Coupon migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
