import cron from "node-cron";
import { Professional } from "../models/userModel.js";


cron.schedule("*/10 * * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    await Professional.updateMany(
      {},
      {
        $pull: {
          busyDays: { $lt: today }
        }
      }
    );

  } catch (error) {
    
  }
});
