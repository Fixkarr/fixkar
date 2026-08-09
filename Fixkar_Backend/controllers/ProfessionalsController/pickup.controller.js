import { PickupRequest } from "../../models/pickup.model.js";
import { Customer } from "../../models/userModel.js";
import { Professional } from "../../models/userModel.js";
import { Notification } from "../../models/notificationModel.js";
import { io } from "../../server.js";
import { PickupSession } from "../../models/pickupSession.model.js";


// ======================================================
// PROFESSIONAL ACCEPT PICKUP REQUEST
// ======================================================


export const acceptPickupRequest = async (req, res) => {
    try {
        const { pickupRequestId } = req.body;

        if (!pickupRequestId) {
            return res.status(400).json({
                success: false,
                message: "Pickup request ID is required.",
            });
        }

        // =====================================================
        // 1. Find logged-in professional
        // =====================================================

        const professional = await Professional.findOne({
            userId: req.userId,
        })
            .populate({
                path: "userId",
                select: "fullName mobile",
            })
            .populate({
                path: "profession",
                select: "name",
            });

        if (!professional) {
            return res.status(404).json({
                success: false,
                message: "Professional not found.",
            });
        }

        // =====================================================
        // 2. Find pickup request
        // =====================================================

        const pickupRequest =
            await PickupRequest.findById(pickupRequestId);

        if (!pickupRequest) {
            return res.status(404).json({
                success: false,
                message: "Pickup request not found.",
            });
        }

        // =====================================================
        // 3. Security check
        // =====================================================

        if (
            pickupRequest.professionalId.toString() !==
            professional._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "This pickup request is not assigned to you.",
            });
        }

        // =====================================================
        // 4. Request must still be pending
        // =====================================================

        if (pickupRequest.status !== "pending") {
            return res.status(400).json({
                success: false,
                message:
                    `This request is already ${pickupRequest.status}.`,
            });
        }

        // =====================================================
        // 5. Check 60-second expiry
        // =====================================================

        if (
            pickupRequest.expiresAt &&
            new Date(pickupRequest.expiresAt) <= new Date()
        ) {
            pickupRequest.status = "expired";

            await pickupRequest.save();

            return res.status(400).json({
                success: false,
                message: "This pickup request has expired.",
            });
        }

        // =====================================================
        // 6. ACCEPT
        // =====================================================

        pickupRequest.status = "accepted";
        pickupRequest.acceptedAt = new Date();

        await pickupRequest.save();

        // =====================================================
        // 7. Customer
        // =====================================================

        const customer = await Customer.findById(
            pickupRequest.customerId
        ).populate({
            path: "userId",
            select: "fullName mobile",
        });

        if (!customer || !customer.userId) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        // =====================================================
        // 8. Notification
        // =====================================================

        const notification = await Notification.create({
            userId: customer.userId._id,
            title: "Professional Accepted",
            message: `${professional.userId.fullName} accepted your request.`,
            type: "pickup_accepted",
            relatedId: pickupRequest.pickupSessionId,
            isRead: false,
        });

        // =====================================================
        // 9. SOCKET → CUSTOMER
        // =====================================================

        io.to(customer.userId._id.toString()).emit(
            "pickupProfessionalAccepted",
            {
                pickupSessionId:
                    pickupRequest.pickupSessionId,

                pickupRequestId:
                    pickupRequest._id,

                professional: {
                    _id: professional._id,
                    name: professional.userId.fullName,
                    mobile: professional.userId.mobile,
                    profilePicture:
                        professional.profilePicture,
                    profession:
                        professional.profession?.name,
                },

                customerName:
                    pickupRequest.customerName,

                serviceName:
                    pickupRequest.serviceName,

                taskName:
                    pickupRequest.taskName,

                distanceInKm:
                    pickupRequest.distanceInKm,

                durationInMinutes:
                    pickupRequest.durationInMinutes,

                workDate:
                    pickupRequest.workDate,

                workTime:
                    pickupRequest.workTime,

                workAddress:
                    pickupRequest.workAddress,

                problemDescription:
                    pickupRequest.problemDescription,

                customerLocation:
                    pickupRequest.customerLocation,

                charge:
                    pickupRequest.charge,

                status: "accepted",

                // Customer ko sirf information milegi.
                // Booking abhi create nahi hui hai.
                professionalExpiresAt:
                    pickupRequest.expiresAt,
            }
        );

        // =====================================================
        // 10. Response
        // =====================================================

        return res.status(200).json({
            success: true,
            message:
                "Pickup request accepted. Waiting for customer confirmation.",

            pickupRequest: {
                _id: pickupRequest._id,
                pickupSessionId:
                    pickupRequest.pickupSessionId,
                status: pickupRequest.status,
                acceptedAt:
                    pickupRequest.acceptedAt,
            },
        });

    } catch (error) {
        console.error(
            "Accept Pickup Request Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while accepting pickup request.",
        });
    }
};
export const rejectPickupRequest = async (req, res) => {
    try {
        const { pickupRequestId } = req.body;

        if (!pickupRequestId) {
            return res.status(400).json({
                success: false,
                message: "Pickup request ID is required.",
            });
        }

        const professional = await Professional.findOne({
            userId: req.userId,
        });

        if (!professional) {
            return res.status(404).json({
                success: false,
                message: "Professional not found.",
            });
        }

        const pickupRequest =
            await PickupRequest.findById(pickupRequestId);

        if (!pickupRequest) {
            return res.status(404).json({
                success: false,
                message: "Pickup request not found.",
            });
        }

        // Security
        if (
            pickupRequest.professionalId.toString() !==
            professional._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "This pickup request is not assigned to you.",
            });
        }

        // Only pending request can be rejected
        if (pickupRequest.status !== "pending") {
            return res.status(400).json({
                success: false,
                message:
                    `This request is already ${pickupRequest.status}.`,
            });
        }

        // Expired?
        if (
            pickupRequest.expiresAt &&
            new Date(pickupRequest.expiresAt) <= new Date()
        ) {
            pickupRequest.status = "expired";

            await pickupRequest.save();

            return res.status(400).json({
                success: false,
                message: "This pickup request has expired.",
            });
        }

        // =====================================================
        // REJECT
        // =====================================================

        pickupRequest.status = "rejected";
        pickupRequest.rejectedAt = new Date();

        await pickupRequest.save();

        // =====================================================
        // Notify customer
        // =====================================================

        const customer = await Customer.findById(
            pickupRequest.customerId
        ).select("userId");

        if (customer?.userId) {
            io.to(customer.userId.toString()).emit(
                "pickupRequestRejected",
                {
                    pickupRequestId:
                        pickupRequest._id,

                    pickupSessionId:
                        pickupRequest.pickupSessionId,

                    status: "rejected",
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Pickup request rejected.",
        });

    } catch (error) {
        console.error(
            "Reject Pickup Request Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while rejecting pickup request.",
        });
    }
};