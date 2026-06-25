import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";

import { Professional } from "./models/userModel.js";

dotenv.config();

async function addSlugToProfessionals() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected");

    const professionals = await Professional.find()
      .populate("userId", "fullName")
      .populate("profession", "name");

    console.log(`Found ${professionals.length} professionals`);

    for (const pro of professionals) {
      // Already has slug
      if (pro.slug) {
        console.log(`⏭️ Skipped : ${pro.userId?.fullName}`);
        continue;
      }

      const fullName = pro.userId?.fullName || "professional";
      const profession = pro.profession?.name || "service";
      const city = pro.address?.addressLine || "india";

      // Base slug
      let baseSlug = slugify(
        `${fullName}-${profession}-${city}`,
        {
          lower: true,
          strict: true,
          trim: true,
        }
      );

      let slug = baseSlug;

      let count = 1;

      // Ensure uniqueness
      while (await Professional.findOne({ slug })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }

      pro.slug = slug;

      await pro.save();

      console.log(`✅ ${fullName} -> ${slug}`);
    }

    console.log("\n🎉 All professionals updated successfully.");

    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

addSlugToProfessionals();