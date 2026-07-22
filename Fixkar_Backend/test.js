import mongoose from "mongoose";
import dotenv from "dotenv";
import { customAlphabet } from "nanoid";
import { Professional } from "./models/userModel.js";
        import dns from "dns";
dotenv.config();

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  8
);

async function generateUniqueShortCode() {
  let shortCode;
  let exists = true;

  while (exists) {
    shortCode = nanoid();
    exists = await Professional.exists({ shortCode });
  }

  return shortCode;
}

async function addShortCodes() {
  try {
        console.log(process.env.MONGO_URL)
    await mongoose.connect(process.env.MONGO_URL)
        const professionals = await Professional.find({
      $or: [
        { shortCode: { $exists: false } },
        { shortCode: null },
        { shortCode: "" }
      ]
    });

    console.log(`Found ${professionals.length} professionals.`);

    for (const professional of professionals) {
      professional.shortCode = await generateUniqueShortCode();
      await professional.save();

      console.log(
        `${professional._id} -> ${professional.shortCode}`
      );
    }

    console.log("✅ All short codes generated.");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

addShortCodes();
