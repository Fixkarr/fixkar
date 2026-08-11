import mongoose from "mongoose";
import { Professional, User } from "../../models/userModel.js";

export const getAllProfessionals = async (req, res) => {
  try {
    const admin = req.admin;

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found!",
      });
    }

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50,
    );

    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();
    const profession = String(req.query.profession || "").trim();
    const verified = String(req.query.verified || "").trim();

    const skip = (page - 1) * limit;
    const filterConditions = [];

    // =========================================
    // STATUS FILTER
    // =========================================

    if (status) {
      filterConditions.push({ status });
    }

    // =========================================
    // PROFESSION FILTER
    // =========================================

    if (profession) {
      if (!mongoose.isValidObjectId(profession)) {
        return res.status(400).json({
          message: "Invalid profession ID",
        });
      }

      filterConditions.push({
        profession: profession,
      });
    }

    // =========================================
    // MOBILE VERIFICATION FILTER
    // =========================================

    if (verified === "true" || verified === "false") {
      const matchingUsers = await User.find({
        isMobileVerified: verified === "true",
      })
        .select("_id")
        .lean();

      const matchingUserIds = matchingUsers.map((user) => user._id);

      if (!matchingUserIds.length) {
        return res.status(200).json({
          message: "Professionals fetched successfully",
          professionals: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: page > 1,
          },
        });
      }

      filterConditions.push({
        userId: { $in: matchingUserIds },
      });
    }

    // =========================================
    // SEARCH
    // Name / Email / Mobile / User ID /
    // Professional ID
    // =========================================

    if (search) {
      const userSearchConditions = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          mobile: {
            $regex: search,
            $options: "i",
          },
        },
      ];

      if (mongoose.isValidObjectId(search)) {
        userSearchConditions.push({
          _id: search,
        });
      }

      const matchingUsers = await User.find({
        $or: userSearchConditions,
      })
        .select("_id")
        .lean();

      const matchingUserIds = matchingUsers.map((user) => user._id);
      const searchConditions = [];

      if (matchingUserIds.length) {
        searchConditions.push({
          userId: { $in: matchingUserIds },
        });
      }

      if (mongoose.isValidObjectId(search)) {
        searchConditions.push({
          _id: search,
        });
      }

      if (!searchConditions.length) {
        return res.status(200).json({
          message: "Professionals fetched successfully",
          professionals: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: page > 1,
          },
        });
      }

      filterConditions.push({
        $or: searchConditions,
      });
    }

    const professionalFilter =
      filterConditions.length > 0
        ? { $and: filterConditions }
        : {};

    // =========================================
    // FETCH DATA + TOTAL COUNT
    // =========================================

    const [professionals, total] = await Promise.all([
      Professional.find(professionalFilter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .select(`
          +bankDetails.bankName
          +bankDetails.holderName
          +bankDetails.accountNumber
          +bankDetails.ifsc
          +bankDetails.upi
          +bankDetails.panNumber
          +bankDetails.docPicUrl
        `)
        .populate({
          path: "userId",
          model: "User",
          select: `
            +termsAcceptance.accepted
            +termsAcceptance.acceptedAt
            +termsAcceptance.acceptedIP
            +termsAcceptance.policyVersion
            +professionalAcceptance.accepted
            +professionalAcceptance.acceptedAt
            +professionalAcceptance.acceptedIP
            +professionalAcceptance.policyVersion
          `,
        })
        .populate({
          path: "reviews",
          options: {
            sort: { createdAt: -1 },
            limit: 10,
          },
        })
        .populate({
          path: "gallery",
          options: {
            sort: { createdAt: -1 },
            limit: 20,
          },
        })
        .populate({
          path: "profession",
          select: "name image skills",
          populate: {
            path: "skills",
            select: "name",
          },
        })
        .populate({
          path: "selectedSkills",
          select: "name",
        })
        .populate({
          path: "charges",
        })
        .lean(),

      Professional.countDocuments(professionalFilter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      message: "Professionals fetched successfully",
      professionals,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("getAllProfessionals error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
