import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const baseOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

export const loginRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again later." },
  keyGenerator: (req) => ipKeyGenerator(req),
});

export const signupRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many signup attempts. Please try again later." },
  keyGenerator: (req) => ipKeyGenerator(req),
});

export const passwordResetRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many password reset attempts. Please try again later." },
  keyGenerator: (req) => ipKeyGenerator(req),
});

export const otpSendRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many OTP requests. Please try again later." },
  keyGenerator: (req) => {
    const identity = String(req.body?.email || req.body?.phone || "").trim().toLowerCase();
    return `${ipKeyGenerator(req)}:${identity}`;
  },
});

export const otpVerifyRateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many OTP verification attempts. Please try again later." },
  keyGenerator: (req) => {
    const identity = String(req.body?.email || req.body?.phone || "").trim().toLowerCase();
    return `${ipKeyGenerator(req)}:${identity}`;
  },
});
