import { User, Customer } from "../models/userModel.js";
import { Referral } from "../models/referralModel.js";


export const getMyReferral = async (req, res) => {
  try {
    // Auth middleware se user ID
    const userId = req.userid;
    // --------------------------------------------------
    // 1. Logged-in user
    // --------------------------------------------------
    const user = await User.findById(userId).select(
      "fullName role referralCode"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // --------------------------------------------------
    // 2. Referral links
    // --------------------------------------------------

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const customerReferralLink =
      `${frontendUrl}/signup?role=customer&ref=${user.referralCode}`;

    const professionalReferralLink =
      `${frontendUrl}/signup?role=professional&ref=${user.referralCode}`;

    // --------------------------------------------------
    // 3. Referral history
    // --------------------------------------------------

    const referrals = await Referral.find({
      referrerId: user._id,
    }).populate(
        "referredUserId",
        "fullName email role"
      )
      .sort({
        createdAt: -1,
      });

    // --------------------------------------------------
    // 4. Stats
    // --------------------------------------------------

    const totalReferrals = referrals.length;

    const successfulReferrals = referrals.filter(
      (referral) => referral.status === "REWARDED"
    ).length;

    const pendingReferrals = referrals.filter(
      (referral) => referral.status === "REGISTERED"
    ).length;

    const reversedReferrals = referrals.filter(
      (referral) => referral.status === "REVERSED"
    ).length;

    const totalEarned = referrals
      .filter(
        (referral) => referral.status === "REWARDED"
      )
      .reduce(
        (total, referral) =>
          total + referral.rewardAmount,
        0
      );

    // --------------------------------------------------
    // 5. User's current reward credits
    // --------------------------------------------------

    let rewardCredits = 0;

    if (user.role === "customer") {
      const customer = await Customer.findOne({
        userId: user._id,
      }).select("rewardCredits");

      rewardCredits = customer?.rewardCredits || 0;
    }

    // --------------------------------------------------
    // 6. Response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      referral: {
        referralCode: user.referralCode,

        links: {
          customer: customerReferralLink,
          professional: professionalReferralLink,
        },

        stats: {
          totalReferrals,
          successfulReferrals,
          pendingReferrals,
          reversedReferrals,
          totalEarned,
        },

        rewardCredits:
          user.role === "customer"
            ? rewardCredits
            : undefined,

        referrals: referrals.map((referral) => ({
          id: referral._id,

          referredUser: referral.referredUserId
            ? {
                fullName:
                  referral.referredUserId.fullName,
                role:
                  referral.referredUserId.role,
              }
            : null,

          referredRole:
            referral.referredRole,

          rewardAmount:
            referral.rewardAmount,

          rewardType:
            referral.rewardType,

          status:
            referral.status,

          qualifyingBookingId:
            referral.qualifyingBookingId,

          createdAt:
            referral.createdAt,

          rewardedAt:
            referral.rewardedAt,
        })),
      },
    });
  } catch (error) {
    console.error(
      "Get referral details error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch referral details",
    });
  }
};