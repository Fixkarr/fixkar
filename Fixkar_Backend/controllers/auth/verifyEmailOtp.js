import crypto from "crypto";
import redis from "../../services/redisClient.js";
import { generateOtpPlain, compareOtp } from "../../utils/otpHelper.js";
import { User } from "../../models/userModel.js";

const RESET_TOKEN_TTL = 10 * 60; // 10 minutes

const resetTokenHash = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const verifyEmailOtp = async (req, res) => {
  try {
    const email = req.body?.email?.trim();
    const otp = req.body?.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    const recordRaw = await redis.get(`email_otp:${email}`);
    if (!recordRaw) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    const record = JSON.parse(recordRaw);
    const match = await compareOtp(otp, record.hashedOtp);

    if (!match) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await redis.del(`email_otp:${email}`);
    await redis.del(`email_otp_resend:${email}`);

    // Keep the existing signup verification state so the current
    // registration flow continues to work exactly as before.
    await redis.set(`email_verified:${email}`, "true", "EX", 15 * 60);

    // If an account already exists, also issue a short-lived, server-side
    // reset authorization. The client never receives the reset token.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      await redis.set(
        `password_reset:${resetTokenHash(resetToken)}`,
        JSON.stringify({ userId: existingUser._id.toString(), email }),
        "EX",
        RESET_TOKEN_TTL
      );

      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("passwordResetToken", resetToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: RESET_TOKEN_TTL * 1000,
        path: "/",
      });
    }

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("verifyEmailOtp error:", error);
    return res.status(500).json({ message: "Failed to verify OTP." });
  }
};
