import bcrypt from "bcryptjs";
import crypto from "crypto";

export const generateOtpPlain = (digits = 6) => {
  // secure numeric OTP
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
};

export const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

export const compareOtp = async (otp, hashed) => {
  return bcrypt.compare(otp, hashed);
};
