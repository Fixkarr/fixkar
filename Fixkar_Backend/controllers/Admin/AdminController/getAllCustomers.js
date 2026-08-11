import mongoose from "mongoose";
import { Customer, User } from "../../../models/userModel.js";

export const getAllCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = req.query;

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (currentPage - 1) * perPage;

    let customerFilter = {};

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

      // User ID search
      if (mongoose.Types.ObjectId.isValid(searchValue)) {
        userSearchFilter.$or.push({
          _id: searchValue,
        });
      }

      const matchingUsers = await User.find(userSearchFilter)
        .select("_id")
        .lean();

      const matchingUserIds = matchingUsers.map(
        (user) => user._id
      );

      const customerOrConditions = [
        {
          userId: {
            $in: matchingUserIds,
          },
        },
      ];

      // Customer ID search
      if (mongoose.Types.ObjectId.isValid(searchValue)) {
        customerOrConditions.push({
          _id: searchValue,
        });
      }

      customerFilter.$or = customerOrConditions;
    }

    // =========================================
    // FETCH DATA + TOTAL COUNT
    // =========================================

    const [customers, total] = await Promise.all([
      Customer.find(customerFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate({
          path: "userId",
          model: "User",
          select: `
            +termsAcceptance.accepted
            +termsAcceptance.acceptedAt
            +termsAcceptance.acceptedIP
            +termsAcceptance.policyVersion
          `,
        })
        .lean(),

      Customer.countDocuments(customerFilter),
    ]);

    return res.status(200).json({
      message: "Customers fetched successfully",

      customers,

      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages: Math.ceil(total / perPage),
        hasNextPage: currentPage < Math.ceil(total / perPage),
        hasPreviousPage: currentPage > 1,
      },
    });

  } catch (error) {
    console.log("getAllCustomers error:", error);

    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};