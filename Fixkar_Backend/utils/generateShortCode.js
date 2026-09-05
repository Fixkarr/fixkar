import { customAlphabet } from "nanoid";
import crypto from "crypto";
import { User } from "../models/userModel.js";

const nanoid = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    8
);

export function generateShortCode() {
  return nanoid();
}

export const generateUniqueReferralCode = async () => {
  while (true) {
    const code = `FXK${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const existingUser = await User.exists({
      referralCode: code,
    });

    if (!existingUser) {
      return code;
    }
  }
};