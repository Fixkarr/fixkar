import { PickupRequest } from "../../models/pickup.model.js";
import { Professional } from "../../models/userModel.js";


export const getProfessionalPickupRequests = async (req, res) => {
    try {
        const userId = req.userId;

        // Logged-in user se professional find karo
        const professional = await Professional.findOne({
            userId,
            status: "approved",
            onBoarded: true,
        }).select("_id");

        if (!professional) {
            return res.status(404).json({
                success: false,
                message: "Professional profile not found.",
            });
        }

        const now = new Date();

        // Sirf isi professional ki pending aur non-expired requests
        const pickupRequests = await PickupRequest.find({
            professionalId: professional._id,
            status: "pending",
            expiresAt: { $gt: now },
        })
            .populate({
                path: "customerId",
                select: "userId",
                populate: {
                    path: "userId",
                    model: "User",
                    select: "fullName mobile",
                },
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: pickupRequests.length,
            pickupRequests,
        });

    } catch (error) {
        console.error(
            "Get Professional Pickup Requests Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch pickup requests.",
        });
    }
};