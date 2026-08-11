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

    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      profession = "",
      verified = "",
    } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (currentPage - 1) * perPage;

    let professionalFilter = {};

    // =========================================
    // STATUS FILTER
    // =========================================

    if (status) {
      professionalFilter.status = status;
    }

    // =========================================
    // PROFESSION FILTER
    // =========================================

    if (profession) {
      if (mongoose.Types.ObjectId.isValid(profession)) {
        professionalFilter.profession = profession;
      }
    }

    // =========================================
    // MOBILE VERIFICATION FILTER
    // =========================================

    let matchingUserIds = null;

    if (verified === "true") {
      const users = await User.find({
        isMobileVerified: true,
      })
        .select("_id")
        .lean();

      matchingUserIds = users.map((user) => user._id);
    }

    if (verified === "false") {
      const users = await User.find({
        isMobileVerified: false,
      })
        .select("_id")
        .lean();

      matchingUserIds = users.map((user) => user._id);
    }

    if (matchingUserIds) {
      professionalFilter.userId = {
        $in: matchingUserIds,
      };
    }

    // =========================================
    // SEARCH
    // =========================================

    if (search.trim()) {
      const searchValue = search.trim();

      const userSearchFilter = {
        $or: [
          {
            fullName: {
              $regex: searchValue,
              $options: "i",
            },
          },
          {
            email: {
              $regex: searchValue,
              $options: "i",
            },
          },
          {
            mobile: {
              $regex: searchValue,
              $options: "i",
            },
          },
        ],
      };

      // User ID
      if (mongoose.Types.ObjectId.isValid(searchValue)) {
        userSearchFilter.$or.push({
          _id: searchValue,
        });
      }

      const matchingUsers = await User.find(userSearchFilter)
        .select("_id")
        .lean();

      const userIds = matchingUsers.map(
        (user) => user._id
      );

      const searchConditions = [
        {
          userId: {
            $in: userIds,
          },
        },
      ];

      // Professional ID
      if (mongoose.Types.ObjectId.isValid(searchValue)) {
        searchConditions.push({
          _id: searchValue,
        });
      }

      professionalFilter.$or = searchConditions;
    }

    // =========================================
    // FETCH PROFESSIONALS
    // =========================================

    const [professionals, total] = await Promise.all([
      Professional.find(professionalFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)

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
            sort: {
              createdAt: -1,
            },
            limit: 10,
          },
        })

        .populate({
          path: "gallery",
          options: {
            sort: {
              createdAt: -1,
            },
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

    return res.status(200).json({
      message: "Professionals fetched successfully",

      professionals,

      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages: Math.ceil(total / perPage),
        hasNextPage:
          currentPage < Math.ceil(total / perPage),
        hasPreviousPage:
          currentPage > 1,
      },
    });

  } catch (error) {
    console.log(
      "getAllProfessionals error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};