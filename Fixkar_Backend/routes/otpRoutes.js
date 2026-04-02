//otpRoutes.js

import express from "express";
import {sendEmailOtp, sendMobileOtp, verifyEmailOtp, verifyMobileOtp} from "../controllers/auth/otpController.js";
import rateLimit from "express-rate-limit"; 
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 minute
  max: 10,                 // max 10 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
   skip: (req) => {
    return false;
  },
    keyGenerator: (req) => {
    return req.body?.phone || req.ip;
  },

});

router.post("/send", isAuth, limiter, sendMobileOtp);
router.post("/verify", isAuth, limiter, verifyMobileOtp);


router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);


export default router;