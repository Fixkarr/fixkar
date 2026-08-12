import mongoose from "mongoose";
import { Customer, Professional, User } from "../models/userModel.js";

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Valid UserId is required" });
        }

        const user = await User.findById(userId).select("fullName role");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "customer") {
            const customer = await Customer.findOne({ userId: user._id })
                .populate("userId", "fullName");

            return res.status(200).json({
                message: "user fetched successfully",
                user: customer
            });
        }

        if (user.role === "professional") {
            const professional = await Professional.findOne({ userId: user._id })
                .select("-poi -dob")
                .populate("userId", "fullName")
                .populate({
                    path: "reviews",
                    options: {
                        sort: { createdAt: -1 },
                        limit: 10
                    }
                })
                .populate({
                    path: "gallery",
                    options: {
                        sort: { createdAt: -1 },
                        limit: 20
                    }
                })
                .populate({
                    path: "profession",
                    select: "name image skills",
                    populate: {
                        path: "skills",
                        select: "name"
                    }
                })
                .populate({
                    path: "selectedSkills",
                    select: "name"
                })
                // Only public pricing summaries are exposed. Raw form responses
                // can contain onboarding/KYC data and must never be public.
                .populate({
                    path: "charges",
                    select: "formKey purpose summary",
                    match: { purpose: "pricing" }
                });

            return res.status(200).json({
                message: "user fetched successfully",
                user: professional
            });
        }

        return res.status(404).json({ message: "User profile not found" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
