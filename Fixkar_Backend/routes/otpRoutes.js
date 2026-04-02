//otpRoutes.js

import express from "express";
import {sendEmailOtp, sendMobileOtp, verifyEmailOtp, verifyMobileOtp} from "../controllers/auth/otpController.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit"; 
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    if (req.body?.phone) {
      return req.body.phone; // OTP ke liye best
    }

    return ipKeyGenerator(req); // ✅ correct IP handling
  },
});

router.post("/send", isAuth, limiter, sendMobileOtp);
router.post("/verify", isAuth, limiter, verifyMobileOtp);


router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);


export default router;