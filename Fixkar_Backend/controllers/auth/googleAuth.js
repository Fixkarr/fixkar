import { User, Customer, Professional } from "../../models/userModel.js";
import { genToken } from "../../utils/AuthToken.js";
import admin from "../../config/firebaseAdmin.js";
import { generateUniqueReferralCode } from "../../utils/generateShortCode.js";
import { processReferral } from "../../services/referral.service.js";

const setAuthCookie = async (res, userId) => {
  const token = await genToken(userId);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const getUserResponse = async (user) => {
  if (user.role === "customer") {
    return Customer.findOne({ userId: user._id }).populate("userId", "-password");
  }

  if (user.role === "professional") {
    return Professional.findOne({ userId: user._id })
      .select("-poi -dob")
      .populate("userId", "-password")
      .populate({ path: "reviews", options: { sort: { createdAt: -1 }, limit: 10 } })
      .populate({ path: "gallery", options: { sort: { createdAt: -1 }, limit: 20 } })
      .populate({ path: "profession", select: "name image skills serviceType", populate: { path: "skills", select: "name bookingType fixedPrice pricingSource isActive" } })
      .populate({ path: "selectedSkills", select: "name" })
      .populate("charges");
  }
  return null;
};

export const googleAuthSignup = async (req, res) => {
  try {
    const { fullName, email, role, referralCode, acceptedTerms, acceptedProfessionalPolicy } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!acceptedTerms) return res.status(400).json({ message: "Terms acceptance required" });
    if (role === "professional" && !acceptedProfessionalPolicy) return res.status(400).json({ message: "Professional policy acceptance required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "User already exists with this email" });

    const userIP = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const referCode = await generateUniqueReferralCode();
    
    const user = await User.create({
      fullName: fullName || "",
      email,
      role,
      referralCode : referCode,
      termsAcceptance: { accepted: true, acceptedAt: new Date(), acceptedIP: userIP, policyVersion: "v1.0" },
      professionalAcceptance: role === "professional" ? { accepted: true, acceptedAt: new Date(), acceptedIP: userIP, policyVersion: "v1.0" } : undefined,
    });

    if (role === "customer") await Customer.create({ userId: user._id });
    else if (role === "professional") await Professional.create({ userId: user._id, address: { addressLine: "", lat: null, lng: null }, location: { type: "Point", coordinates: [] } });
    else {
      await User.deleteOne({ _id: user._id });
      return res.status(400).json({ message: "Invalid role" });
    }
      try {
      await processReferral({
        referralCode,
        referredUser: user,
      });
    } catch (referralError) {
      console.error("Referral processing failed:", referralError);
    }
    await setAuthCookie(res, user._id);
    return res.status(201).json({ message: "Google signup successful", user: await getUserResponse(user) });
  } catch (error) {
    console.error("Google signup error:", error);
    return res.status(500).json({ message: "Google auth error" });
  }
};

export const googleAuthLogin = async (req, res) => {
  try {
    const email = req.body?.email;
    if (!email) return res.status(401).json({ message: "Google sign-in could not be completed. Please try again." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No Fixkar account was found for this Google account. Please sign up first." });

    const userData = await getUserResponse(user);
    if (!userData) return res.status(400).json({ message: "Unable to complete sign-in." });

    await setAuthCookie(res, user._id);
    return res.status(200).json({ message: "Google login successful", user: userData });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google sign-in failed. Please try again." });
  }
};

export const googleAuthLoginNative = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "Google sign-in could not be completed. Please try again." });
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.email || !decodedToken.email_verified) return res.status(401).json({ message: "Google sign-in could not be completed. Please try again." });

    const user = await User.findOne({ email: decodedToken.email });
    if (!user) return res.status(404).json({ message: "No Fixkar account was found for this Google account. Please sign up first." });

    const userData = await getUserResponse(user);
    if (!userData) return res.status(400).json({ message: "Unable to complete sign-in." });
    await setAuthCookie(res, user._id);
    return res.status(200).json({ message: "Google login successful", user: userData });
  } catch (error) {
    console.error("Native Google Login Error:", error);
    return res.status(401).json({ message: "Google sign-in could not be completed. Please try again." });
  }
};

export const googleAuthSignupNative = async (req, res) => {
  try {
    const { idToken, role, referralCode, acceptedTerms, acceptedProfessionalPolicy } = req.body;
    if (!idToken) return res.status(400).json({ message: "Google sign-in could not be completed. Please try again." });
    if (!acceptedTerms) return res.status(400).json({ message: "Terms acceptance required" });
    if (role === "professional" && !acceptedProfessionalPolicy) return res.status(400).json({ message: "Professional policy acceptance required" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.email || !decodedToken.email_verified) return res.status(401).json({ message: "Google sign-in could not be completed. Please try again." });

    const existingUser = await User.findOne({ email: decodedToken.email });
    if (existingUser) return res.status(409).json({ message: "User already exists with this email" });

    const userIP = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const referCode = await generateUniqueReferralCode();
    const user = await User.create({
      fullName: decodedToken.name || "",
      email: decodedToken.email,
      role,
      referralCode : referCode,
      termsAcceptance: { accepted: true, acceptedAt: new Date(), acceptedIP: userIP, policyVersion: "v1.0" },
      professionalAcceptance: role === "professional" ? { accepted: true, acceptedAt: new Date(), acceptedIP: userIP, policyVersion: "v1.0" } : undefined,
    });

    if (role === "customer") await Customer.create({ userId: user._id });
    else if (role === "professional") await Professional.create({ userId: user._id, address: { addressLine: "", lat: null, lng: null }, location: { type: "Point", coordinates: [] } });
    else {
      await User.deleteOne({ _id: user._id });
      return res.status(400).json({ message: "Invalid role" });
    }
   try {
  await processReferral({
    referralCode,
    referredUser: user,
  });
} catch (referralError) {
  console.error("Referral processing failed:", referralError);
}
    await setAuthCookie(res, user._id);
    return res.status(201).json({ message: "Google signup successful", user: await getUserResponse(user) });
  } catch (error) {
    console.error("Native Google Signup Error:", error);
    return res.status(401).json({ message: "Google sign-up could not be completed. Please try again." });
  }
};
