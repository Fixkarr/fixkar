//otpController.js
import jwt from "jsonwebtoken";
import redis from "../../services/redisClient.js";
import Joi from "joi";
import { generateOtpPlain, hashOtp, compareOtp } from "../../utils/otpHelper.js";
import { Customer, Professional, User } from "../../models/userModel.js";
import { sendEmail } from "../../utils/mailer.js";
import axios from "axios";


const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY_SECONDS || "300"); // seconds
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || "5");
const OTP_RESEND_COOLDOWN = parseInt(process.env.OTP_RESEND_COOLDOWN || "60"); // seconds
 
// Validation schemas
const sendSchema = Joi.object({
  phone: Joi.string().pattern(/^\+\d{10,15}$/).required()
});
const verifySchema = Joi.object({
  phone: Joi.string().pattern(/^\+\d{10,15}$/).required(),
  otp: Joi.string().length(6).pattern(/^\d{6}$/).required()
});

const otpKey = (phone) => `otp:${phone}`;               // stores { hashedOtp, createdAt }
const otpAttemptsKey = (phone) => `otp_attempts:${phone}`; // stores integer
const otpResendKey = (phone) => `otp_resend:${phone}`; // cooldown key

 
export const sendMobileOtp = async (req, res) => {
  try {
    // validate input
    const { error, value } = sendSchema.validate(req.body);
   
    if (error) return res.status(400).json({ message: "invalid phone number" });

    const { phone } = value;

    // resend cooldown
    const canResend = await redis.get(otpResendKey(phone));
    if (canResend) {
      return res.status(429).json({ message: `Please wait ${canResend}s before requesting a new OTP.` });
    }

    // generate OTP
    const plainOtp = generateOtpPlain(6);
    const hashed = await hashOtp(plainOtp);

    // store hashed OTP with TTL in redis (atomic set)
    await redis.set(otpKey(phone), JSON.stringify({
      hashedOtp: hashed,
      createdAt: Date.now()
    }), "EX", OTP_EXPIRY);

    // reset attempts counter
    await redis.del(otpAttemptsKey(phone));

    // set resend cooldown
    await redis.set(otpResendKey(phone), `${OTP_RESEND_COOLDOWN}`, "EX", OTP_RESEND_COOLDOWN);

    
    const response = await axios.get(
      `https://api.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=91${phone}&authkey=${process.env.MSG91_AUTH_KEY}`
    );
      console.log("MSG91 RESPONSE:", response.data);
    // respond (do not return OTP)
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ message: "Failed to send OTP." });
  }
};

export const verifyMobileOtp = async (req, res) => {
  try {
    const { error, value } = verifySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { phone, otp } = value;

    // 🔥 attempts check (REDIS BACK)
    const attempts = parseInt(await redis.get(otpAttemptsKey(phone)) || "0", 10);

    if (attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({
        message: "Maximum attempts reached. Please request a new OTP.",
      });
    }

    // 🔥 MSG91 VERIFY
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=91${phone}&otp=${otp}&authkey=${process.env.MSG91_AUTH_KEY}`
    );

  
    const data = await response.json();

    if (data.type !== "success") {
      
      const newAttempts = await redis.incr(otpAttemptsKey(phone));

      const ttl = await redis.ttl(otpAttemptsKey(phone));
      if (ttl === -1) {
        await redis.expire(otpAttemptsKey(phone), OTP_EXPIRY);
      }

      return res.status(400).json({ message: "Invalid OTP." });
    }

   
    await redis.del(otpAttemptsKey(phone));
    await redis.del(otpResendKey(phone));

    const user = await User.findByIdAndUpdate(
      req.userId,
      { mobile: phone, isMobileVerified: true },
      { new: true }
    );

    if (user.role === "customer") {
      const customer = await Customer.findOne({ userId: user._id }).populate("userId");
      return res.status(200).json({
        message: "OTP verified successfully",
        user: customer,
      });
    } else if (user.role === "professional") {
      const professional = await Professional.findOne({ userId: user._id }).populate("userId");
      return res.status(200).json({
        message: "OTP verified successfully",
        user: professional,
      });
    } else {
      return res.status(200).json({
        message: "OTP verified successfully",
        user,
      });
    }

  } catch (err) {
    console.error("verifyOtp error:", err?.response?.data || err.message);
    return res.status(500).json({ message: "OTP verification failed." });
  }
};


// forget password api controller

export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const canResend = await redis.get(`email_otp_resend:${email}`);
    if (canResend) {
      return res.status(429).json({ message: `Please wait before requesting new OTP.` });
    }

    const plainOtp = generateOtpPlain(6);
    const hashedOtp = await hashOtp(plainOtp);

    await redis.set(`email_otp:${email}`, JSON.stringify({
      hashedOtp,
      createdAt: Date.now()
    }), "EX", OTP_EXPIRY);

    await redis.set(`email_otp_resend:${email}`, OTP_RESEND_COOLDOWN, "EX", OTP_RESEND_COOLDOWN);

    try {
      const subject = "Your FixKar OTP"
      const content = `
<div style="background-color:#f4f6f8;padding:30px 0;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#0d6efd;padding:20px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:1px;">
        FixKar
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:25px;color:#333333;">
      <h2 style="margin-top:0;font-size:20px;color:#0d6efd;">
        OTP Verification
      </h2>

      <p style="font-size:14px;line-height:1.6;margin-bottom:20px;">
        Hello,<br/>
        Use the OTP below to verify your email address. This OTP is valid for
        <b>5 minutes</b>.
      </p>

      <!-- OTP Box -->
      <div style="text-align:center;margin:30px 0;">
        <span style="
          display:inline-block;
          background:#f1f5ff;
          color:#0d6efd;
          font-size:32px;
          font-weight:700;
          letter-spacing:6px;
          padding:12px 24px;
          border-radius:8px;
          border:1px dashed #0d6efd;
        ">
          ${plainOtp}
        </span>
      </div>

      <p style="font-size:13px;color:#666666;line-height:1.5;">
        If you didn’t request this OTP, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8f9fa;padding:15px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#888888;">
        © ${new Date().getFullYear()} FixKar. All rights reserved.
      </p>
    </div>

  </div>
</div>
`
      await sendEmail(email, subject, content);
    } catch (emailErr) {
      // rollback OTP if email fails
      await redis.del(`email_otp:${email}`);
      await redis.del(`email_otp_resend:${email}`);
      return res.status(500).json({
        message: "Failed to send OTP Please try again.",
      });
    }

    return res.status(200).json({ message: "OTP sent to email successfully." });
  } catch (error) {
    console.error("sendEmailOtp error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};


export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "OTP required" });

    const recordRaw = await redis.get(`email_otp:${email}`);
    if (!recordRaw) return res.status(400).json({ message: "OTP expired or not found" });

    const record = JSON.parse(recordRaw);
    const match = await compareOtp(otp, record.hashedOtp);

    if (!match) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

     await redis.set(
      `email_verified:${email}`,
      "true",
      "EX",
      15 * 60 // ⏱️ 15 minutes validity
    );

    await redis.del(`email_otp:${email}`);
    await redis.del(`email_otp_resend:${email}`);

    // ✅ Here you can mark user verified or allow password reset
    // e.g. set a temporary token for reset page access

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to verify OTP." });
  }
};



