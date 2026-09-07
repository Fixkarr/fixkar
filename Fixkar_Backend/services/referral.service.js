import { Referral } from "../models/referralModel.js";
import { User } from "../models/userModel.js";
import { Customer } from "../models/userModel.js";
import { Professional } from "../models/userModel.js";

import { Wallet } from "../models/walletModel.js";
import  {Booking}  from "../models/bookingModel.js";

const normalizeMobile = (mobile) => {
  const digits = String(mobile || "").replace(/\D/g, "");

  // Indian numbers ke liye last 10 digits
  return digits.length >= 10 ? digits.slice(-10) : digits;
};


export const processReferral = async ({
  referralCode,
  referredUser,
}) => {
  // Referral code nahi aaya
  if (!referralCode) {
    return null;
  }

  // Referrer find karo
  const referrer = await User.findOne({
    referralCode: referralCode.trim().toUpperCase(),
  });

  // Invalid referral code
  if (!referrer) {
    return null;
  }

  // Referred user ko pehle se kisi referral ke through register kiya gaya hai ya nahi
  const existingReferral = await Referral.findOne({
    referredUserId: referredUser._id,
  });

  if (existingReferral) {
    return existingReferral;
  }

  // Referred user ke role ke according reward
  const rewardAmount =
    referredUser.role === "professional" ? 100 : 20;

  // Referrer ke role ke according reward destination
  const rewardType =
    referrer.role === "professional"
      ? "WALLET_CASH"
      : "REWARD_CREDIT";

  // Referral record create
  const referral = await Referral.create({
    referrerId: referrer._id,
    referredUserId: referredUser._id,
    referrerRole: referrer.role,
    referredRole: referredUser.role,
    referralCode: referrer.referralCode,
    rewardAmount,
    rewardType,
    status: "REGISTERED",
    qualifyingBookingId: null,
    rewardedAt: null,
  });

  return referral;
};

export const processReferralReward = async ({completedBookingId,}) => {
  try {
      const completedBooking = await Booking.findOne({
      _id: completedBookingId,
      status: "completed",
    });

    if (!completedBooking) {
      return {
        rewarded: false,
        reason: "INVALID_COMPLETED_BOOKING",
      };
    }

    // 2. Booking ke basis par referred User find karo
    let referredUser = null;

    if (completedBooking.customerId) {
      const customer = await Customer.findById(
        completedBooking.customerId
      ).select("userId");

      if (customer) {
        referredUser = await User.findById(customer.userId);
      }
    }

    if (!referredUser && completedBooking.professionalId) {
      const professional = await Professional.findById(
        completedBooking.professionalId
      ).select("userId");

      if (professional) {
        referredUser = await User.findById(professional.userId);
      }
    }

    if (!referredUser) {
      return {
        rewarded: false,
        reason: "REFERRED_USER_NOT_FOUND",
      };
    }

    // 3. Ab referral find karo
    const referral = await Referral.findOne({
      referredUserId: referredUser._id,
    });

    if (!referral) {
      return {
        rewarded: false,
        reason: "NO_REFERRAL",
      };
    }

    // 2. Already rewarded hai to dobara reward nahi
    if (referral.status === "REWARDED") {
      return {
        rewarded: false,
        reason: "ALREADY_REWARDED",
        referral,
      };
    }

    // Reversed referral ko bhi dobara process mat karo
    if (referral.status === "REVERSED") {
      return {
        rewarded: false,
        reason: "REFERRAL_REVERSED",
        referral,
      };
    }

     const referrer = await User.findById(
      referral.referrerId
    );

    if (!referrer) {
      return {
        rewarded: false,
        reason: "REFERRER_NOT_FOUND",
      };
    }

    // 4. Same mobile number check
    const referrerMobile = normalizeMobile(referrer.mobile);
    const referredMobile = normalizeMobile(referredUser.mobile);

    if (
      referrerMobile &&
      referredMobile &&
      referrerMobile === referredMobile
    ) {
      referral.status = "REVERSED";
      await referral.save();

      return {
        rewarded: false,
        reason: "SAME_MOBILE",
        message:
          "You are not eligible for this referral reward because the same mobile number was used for both accounts.",
        referral,
      };
    }

    // 5. Referred user ka actual Customer / Professional document find karo
    let referredProfile;

    if (referredUser.role === "customer") {
      referredProfile = await Customer.findOne({
        userId: referredUser._id,
      });
    } else if (referredUser.role === "professional") {
      referredProfile = await Professional.findOne({
        userId: referredUser._id,
      });
    }

    if (!referredProfile) {
      return {
        rewarded: false,
        reason: "REFERRED_PROFILE_NOT_FOUND",
      };
    }

    // 6. Current completed booking verify karo
       const bookingBelongsToUser =
      referredUser.role === "customer"
        ? completedBooking.customerId.toString() ===
          referredProfile._id.toString()

        : completedBooking.professionalId.toString() ===
          referredProfile._id.toString();


            if (!bookingBelongsToUser) {
      return {
        rewarded: false,
        reason: "BOOKING_NOT_BELONG_TO_REFERRED_USER",
      };
    }

    if (referredUser.role === "customer") {
      bookingQuery.customerId = referredProfile._id;
    } else {
      bookingQuery.professionalId = referredProfile._id;
    }

    // 7. Check karo ki ye referred user ki FIRST completed booking hai
    const previousCompletedBookingQuery = {
      _id: { $ne: completedBooking._id },
      status: "completed",
    };

    if (referredUser.role === "customer") {
      previousCompletedBookingQuery.customerId = referredProfile._id;
    } else {
      previousCompletedBookingQuery.professionalId = referredProfile._id;
    }

    const previousCompletedBooking = await Booking.findOne(
      previousCompletedBookingQuery
    )

    if (previousCompletedBooking) {
      return {
        rewarded: false,
        reason: "NOT_FIRST_COMPLETED_BOOKING",
      };
    }

    // 8. Referral ka qualifying booking save karo
    referral.qualifyingBookingId = completedBooking._id;

    // 9. Reward actually do
    if (referral.referrerRole === "professional") {
      // Professional ko wallet pending balance me reward
      const professional = await Professional.findOne({
        userId: referrer._id,
      });

      if (!professional) {
        return {
          rewarded: false,
          reason: "REFERRER_PROFESSIONAL_NOT_FOUND",
        };
      }

      const wallet = await Wallet.findOne({
        professionalId: professional._id,
      });

      if (!wallet) {
        return {
          rewarded: false,
          reason: "REFERRER_WALLET_NOT_FOUND",
        };
      }

      wallet.pendingBalance += referral.rewardAmount;
      wallet.totalEarned += referral.rewardAmount;

      await wallet.save();
    } else {
         const customer = await Customer.findOne({
    userId: referrer._id,
  });

  if (!customer) {
    return {
      rewarded: false,
      reason: "REFERRER_CUSTOMER_NOT_FOUND",
    };
  }

  customer.rewardCredits = (customer.rewardCredits || 0) + referral.rewardAmount;

  await customer.save();
    }

    // 10. Reward successful
    referral.status = "REWARDED";
    referral.rewardedAt = new Date();

    await referral.save();

    return {
      rewarded: true,
      reason: "REWARD_GRANTED",
      rewardAmount: referral.rewardAmount,
      rewardType: referral.rewardType,
      referral,
    };
  } catch (error) {
    console.error("Process referral reward error:", error);
    throw error;
  }
};