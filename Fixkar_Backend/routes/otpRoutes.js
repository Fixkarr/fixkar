//otpRoutes.js

import express from "express";
import {sendEmailOtp, sendMobileOtp, verifyMobileOtp} from "../controllers/auth/otpController.js";
import { verifyEmailOtp } from "../controllers/auth/verifyEmailOtp.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit"; 
import { isAuth } from "../middlewares/isAuth.js";
import { otpSendRateLimiter, otpVerifyRateLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const phone = String(req.body?.phone || "").trim();
    return `${ipKeyGenerator(req)}:${phone}`;
  },
});

router.post("/send", isAuth, limiter, sendMobileOtp);
router.post("/verify", isAuth, limiter, verifyMobileOtp);
router.post("/firebase-phone-verify", isAuth, limiter, verifyMobileOtp);

router.post("/send-email-otp", otpSendRateLimiter, sendEmailOtp);
router.post("/verify-email-otp", otpVerifyRateLimiter, verifyEmailOtp);

export default router;
