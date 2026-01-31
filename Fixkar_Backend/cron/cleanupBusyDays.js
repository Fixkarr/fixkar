import cron from "node-cron";
import { Professional } from "../models/userModel.js";


cron.schedule("*/1 * * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const result = await Professional.updateMany(
      {},
      {
        $pull: {
          busyDays: { $lt: today }
        }
      }
    );

    console.log("✅ Busy days cleanup done", result.modifiedCount);
  } catch (error) {
    
  }
});
