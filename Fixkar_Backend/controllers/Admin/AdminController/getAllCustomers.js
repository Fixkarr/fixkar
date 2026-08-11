import mongoose from "mongoose";
import { Customer, User } from "../../../models/userModel.js";

export const getAllCustomers = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50,
    );

    const search = String(req.query.search || "").trim();
    const skip = (page - 1) * limit;

    const customerFilter = {};

    if (search) {
      const userConditions = [
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
        userConditions.push({ _id: search });
      }

      const matchingUsers = await User.find({
        $or: userConditions,
      })
        .select("_id")
        .lean();

      const matchingUserIds = matchingUsers.map((user) => user._id);
      const matchingCustomerConditions = [];

      if (matchingUserIds.length) {
        matchingCustomerConditions.push({
          userId: { $in: matchingUserIds },
        });
      }

      if (mongoose.isValidObjectId(search)) {
        matchingCustomerConditions.push({ _id: search });
      }

      if (!matchingCustomerConditions.length) {
        return res.status(200).json({
          message: "Customers fetched successfully",
          customers: [],
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

      customerFilter.$or = matchingCustomerConditions;
    }

    const [customers, total] = await Promise.all([
      Customer.find(customerFilter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
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

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      message: "Customers fetched successfully",
      customers,
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
    console.error("getAllCustomers error:", error);

    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};
