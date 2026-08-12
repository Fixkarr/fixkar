import mongoose from "mongoose";
import { Professional } from '../../models/userModel.js';

export const getProfessionalInfo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Valid Professional ID is required" });
        }

        const professionalInfo = await Professional.findOne({ userId: id })
            .select('-poi -dob -bankDetails')
            .populate("userId", 'fullName')
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
                select: "name image skills serviceType",
                populate: {
                    path: "skills",
                    select: "name bookingType fixedPrice pricingSource isActive"
                }
            })
            .populate({
                path: "selectedSkills",
                select: "name bookingType fixedPrice pricingSource isActive"
            })
            .populate({
                path: 'taskPricing.skill',
                select: 'name'
            })
            // Raw form responses may contain onboarding/KYC data. Only public
            // pricing summaries are allowed in this public profile response.
            .populate({
                path: 'charges',
                select: 'formKey purpose summary',
                match: { purpose: 'pricing' }
            });

        if (!professionalInfo) {
            return res.status(404).json({ message: "Professional not found" });
        }

        return res.status(200).json({ professionalInfo });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};
