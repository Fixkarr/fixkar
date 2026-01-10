//otpController.js
import jwt from "jsonwebtoken";
import redis from "../../services/redisClient.js";
import { client } from "../../utils/twilioClient.js";
import Joi from "joi";
import { generateOtpPlain, hashOtp, compareOtp } from "../../utils/otpHelper.js";
import { Customer, Professional, User } from "../../models/userModel.js";
import { sendEmailOtps } from "../../utils/mailer.js";


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

    // Send SMS via Twilio (non-blocking best practice: await, but handle errors)
    await client.messages.create({
      body: `Your Fixkar verification code is ${plainOtp}. It is valid for ${Math.floor(OTP_EXPIRY/60)} minutes.`,
      from: process.env.TWILIO_PHONE,
      to: phone
    });
    
    // respond (do not return OTP)
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ message: "Failed to send OTP." });
  }
};

export const verifyMobileOtp = async (req, res) => {
  try {
    // validate input
    const { error, value } = verifySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { phone, otp } = value;

    // fetch OTP record
    const recordRaw = await redis.get(otpKey(phone));
    if (!recordRaw) return res.status(400).json({ message: "OTP not found or expired. Please request a new OTP." });

    const record = JSON.parse(recordRaw);
    const hashedOtp = record.hashedOtp;

    // attempts check
    const attempts = parseInt(await redis.get(otpAttemptsKey(phone)) || "0", 10);
    if (attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ message: "Maximum attempts reached. Please request a new OTP." });
    }

    // compare securely
    const match = await compareOtp(otp, hashedOtp);
    if (!match) {
      // increment attempts and set expiry on attempts key equal to OTP expiry to avoid permanent lock
      const newAttempts = await redis.incr(otpAttemptsKey(phone));
      // set TTL on attempts same as otp expiry if not already set
      const ttl = await redis.ttl(otpAttemptsKey(phone));
      if (ttl === -1) {
        await redis.expire(otpAttemptsKey(phone), OTP_EXPIRY);
      }
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // success: delete otp keys and attempts
    await redis.del(otpKey(phone));
    await redis.del(otpAttemptsKey(phone));
    await redis.del(otpResendKey(phone)); // allow immediate resend next time

    const user = await User.findByIdAndUpdate(req.userId, {mobile : phone, isMobileVerified : true}, {new : true});
    // At this point, mark the user's phone as verified in DB:
    // e.g., await User.findOneAndUpdate({ phone }, { mobileVerified: true })
    // but controller should not assume DB model; return success and let calling code update user record
    if(user.role === "customer"){
      const customer = await Customer.findOne({userId : user._id}).populate("userId");
      return res.status(200).json({
        message : "OTP verified successfully",
        user : customer
      })
    }else if(user.role === "professional"){
       const professional = await Professional.findOne({userId : user._id}).populate("userId");
      return res.status(200).json({
        message : "OTP verified successfully",
        user : professional
      }) 
    }else{
      return res.status(200).json({ message: "OTP verified successfully.",
      user
     });
    }
    
  } catch (err) {
    console.error("verifyOtp error:", err);
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
      await sendEmailOtps(email, plainOtp);
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



