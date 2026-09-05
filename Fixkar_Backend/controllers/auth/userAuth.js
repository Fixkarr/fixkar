import { User, Customer, Professional } from "../../models/userModel.js";
import bcrypt from 'bcryptjs'
import { genToken } from '../../utils/AuthToken.js';
import redis from "../../services/redisClient.js";
import { validatePassword } from "../../utils/passwordPolicy.js";
import { generateUniqueReferralCode } from "../../utils/generateShortCode.js";
import { processReferral } from "../../services/referral.service.js";

const isProduction = process.env.NODE_ENV === "production";
const userCookieOptions = {
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  httpOnly: true,
  path: "/",
};

const clearAdminCookie = (res) => {
  res.clearCookie("adminToken", userCookieOptions);
};

export const registerUserWithForm = async (req, res) => {
    const { fullName, email, password, role, referralCode, acceptedTerms, acceptedProfessionalPolicy } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All Fields are required" })
        }

        const passwordError = validatePassword(password);
        if (passwordError) return res.status(400).json({ message: passwordError });

        const isEmailVerified = await redis.get(`email_verified:${email}`);
        if (!isEmailVerified) return res.status(403).json({ message: "Please verify your email before signup" });
        if (!acceptedTerms) return res.status(400).json({ message: "Terms acceptance required" });
        if (role === "professional" && !acceptedProfessionalPolicy) return res.status(400).json({ message: "Professional policy acceptance required" });

        const userIP = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists with this email" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const referCode = await generateUniqueReferralCode();
        const newUser = await User.create({
            fullName, email, password: hashedPassword, role, referralCode : referCode,
            termsAcceptance: { accepted: true, acceptedAt: new Date(), acceptedIP: userIP, policyVersion: "v1.0" },
            professionalAcceptance: role === "professional" ? { accepted: true, acceptedAt: new Date(), acceptedIP: userIP, policyVersion: "v1.0" } : undefined,
        });

        await redis.del(`email_verified:${email}`);
        const token = await genToken(newUser._id);
        res.cookie("token", token, { ...userCookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        clearAdminCookie(res);

        if (role === "customer") {
            await Customer.create({ userId: newUser._id });
            const customer = await Customer.findOne({ userId: newUser._id }).populate("userId");
            return res.status(201).json({ message: "user registered successfully", user: customer });
        }
        if (role === "professional") {
            await Professional.create({ userId: newUser._id, address: { addressLine: "", lat: null, lng: null }, location: { type: "Point", coordinates: [] } });
            const professional = await Professional.findOne({ userId: newUser._id }).populate("userId", '-password');
            return res.status(201).json({ message: "user registered successfully", user: professional });
        }

       try {
  await processReferral({
    referralCode,
    referredUser: newUser,
  });
} catch (referralError) {
  console.error("Referral processing failed:", referralError);
}

        return res.status(400).json({ message: "No role assigned to this user" });
    } catch (error) {
        console.log("error in registerCustomerWithForm controller", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ message: "All Fields are required" });

       const existingUser = await User.findOne({ email }).select("+password");

if (!existingUser) {
    return res.status(400).json({
        message: "User does not exists. Please register first"
    });
}

if (!existingUser.password) {
    return res.status(400).json({
        message: "Invalid credentials"
    });
}

const isValidPassword = await bcrypt.compare(
    password,
    existingUser.password
);

if (!isValidPassword) {
    return res.status(400).json({
        message: "Invalid credentials"
    });
}

        const token = await genToken(existingUser._id);
        res.cookie("token", token, { ...userCookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        clearAdminCookie(res);

        let userData;
        if (existingUser.role === "customer") {
            userData = await Customer.findOne({ userId: existingUser._id }).populate("userId", '-password');
        } else if (existingUser.role === "professional") {
            userData = await Professional.findOne({ userId: existingUser._id }).select('-poi -dob').populate("userId", '-password').populate({ path: "reviews", options: { sort: { createdAt: -1 }, limit: 10 } }).populate({ path: "gallery", options: { sort: { createdAt: -1 }, limit: 20 } }).populate({ path: "profession", select: "name image skills serviceType", populate: { path: "skills", select: "name bookingType fixedPrice pricingSource isActive" } }).populate({ path: "selectedSkills", select: "name" }).populate("charges");
        } else {
            return res.status(400).json({ message: "No role assigned to this user" })
        }

        return res.status(200).json({ message: "User logged in successfully", user: userData });
    } catch (error) {
        console.log("error in login controller", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", userCookieOptions);
    return res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    console.log("error in signOutCustomer", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ message: "Password reset successfully!" });
}
