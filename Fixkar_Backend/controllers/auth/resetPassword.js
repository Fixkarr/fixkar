import crypto from "crypto";
import bcrypt from "bcryptjs";
import redis from "../../services/redisClient.js";
import { User } from "../../models/userModel.js";
import { validatePassword } from "../../utils/passwordPolicy.js";

const RESET_TOKEN_TTL = 10 * 60;

const resetTokenHash = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const resetPassword = async (req, res) => {
  try {
    const newPassword = req.body?.newPassword;
    const passwordError = validatePassword(newPassword);

    if (passwordError) {
      return res.status(400).json({
        message: passwordError,
      });
    }

    const resetToken = req.cookies?.passwordResetToken;

    if (!resetToken) {
      return res.status(401).json({
        message: "Password reset authorization required",
      });
    }

    const key = `password_reset:${resetTokenHash(resetToken)}`;
    const recordRaw = await redis.get(key);

    if (!recordRaw) {
      return res.status(401).json({
        message: "Password reset authorization expired or invalid",
      });
    }

    const record = JSON.parse(recordRaw);
    const user = await User.findById(record.userId);

    if (!user || user.email !== record.email) {
      await redis.del(key);
      return res.status(401).json({
        message: "Password reset authorization is invalid",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await redis.del(key);

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("passwordResetToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
