import cron from "node-cron";
import { Professional } from "../models/userModel.js";


cron.schedule("1 0 * * *", async () => {
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

    
  } catch (error) {
    
  }
});
