import { Booking } from "../../models/bookingModel.js";
import { Customer, Professional } from "../../models/userModel.js";
import mongoose from "mongoose";

export const getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.query;

        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({
                message: "Valid booking id is required"
            });
        }

        const [customer, professional] = await Promise.all([
            Customer.findOne({ userId: req.userId }).select("_id"),
            Professional.findOne({ userId: req.userId }).select("_id"),
        ]);

        const ownershipFilters = [];
        if (customer) ownershipFilters.push({ customerId: customer._id });
        if (professional) ownershipFilters.push({ professionalId: professional._id });

        if (ownershipFilters.length === 0) {
            return res.status(403).json({ message: "Access denied" });
        }

        const booking = await Booking.findOne({
            _id: bookingId,
            $or: ownershipFilters,
        }).populate({
            path: "customerId",
            populate: {
                path: "userId",
                model: "User",
                select: "fullName"
            }
        }).populate({
            path: "professionalId",
            select: "profilePicture address userId profession shortCode",
            populate: [{
                path: "userId",
                model: "User",
                select: "fullName",
            },
            { path: "profession", select: "name image skills", populate: { path: "skills", select: "name" } },
            { path: "selectedSkills", select: "name" }
            ],
        }).populate("review");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            booking
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Internal server error!"
        });
    }
};
