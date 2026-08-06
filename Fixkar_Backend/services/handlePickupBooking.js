import { Booking } from "../models/bookingModel.js";
import { Notification } from "../models/notificationModel.js";
import { io } from "../server.js";
import { findEligibleProfessionals } from "./matchingEngine.js";
import { calculateDistanceForProfessionals } from "./calculateDistanceForProfessionals.js";
import { pushNotification } from "./pushNotification.js";
import { sendWhatsAppMessage } from "../utils/sendWhatsaAppMessage.js";

export const handlePickupBooking = async ({
    req,
    res,
    customerId,
    customerName,
    mobileNumber,
    workDate,
    workTime,
    workAddress,
    problemDescription,
    task,
    service,
    customerLat,
    customerLng,
    audioMessages,
}) => {
    try {
        const eligibleProfessionals =
            await findEligibleProfessionals({
                serviceId: service._id,
                taskId: task._id,
                workDate,
                customerLat,
                customerLng,
                radiusInKm: 15,
                limit: 10,
            });

        if (eligibleProfessionals.length === 0) {
            return res.status(404).json({
                message:
                    "No professionals are available nearby.",
            });
        }

        // STEP-2
        // Calculate actual road distance
        const nearbyProfessionals =
            await calculateDistanceForProfessionals({
                customerLocation: {
                    lat: Number(customerLat),
                    lng: Number(customerLng),
                },
                professionals: eligibleProfessionals,
            });

        if (nearbyProfessionals.length === 0) {
            return res.status(404).json({
                message: "No nearby professionals found.",
            });
        }
        // STEP-3
        // Sort by actual road distance
        nearbyProfessionals.sort(
            (a, b) => a.distanceInKm - b.distanceInKm
        );

        // STEP-4
        // Keep only nearest 5 professionals
        const topProfessionals =
            nearbyProfessionals.slice(0, 5);
        // STEP-5
        // Create booking in searching state
        const booking = await Booking.create({
            customerId,
            professionalId: null,
            customerName,
            mobileNumber,
            workDate,
            workTime,
            workAddress,
            problemDescription,
            audioMessages,
            service: service._id,
            task: task._id,
            pricingType: task.bookingType,
            serviceCharge:
                task.pricingSource === "admin"
                    ? task.fixedPrice
                    : null,
            totalAmount: null,
            visitingCharge: null,
            isPriceLocked: false,
            status: "searching",
        });

        // STEP-6
        // Next Part
        // Send pickup request to nearest professionals

        for (const item of topProfessionals) {
            const professional = item.professional;
            const notification = await Notification.create({
                userId: professional.userId._id,
                title: "New Pickup Request",
                message: `${customerName} needs a ${service.name}.`,
                type: "pickup_request",
                relatedId: booking._id,
                isRead: false,
            });

            // Push Notification
            await pushNotification({
                userId: professional.userId._id,
                title: notification.title,
                message: notification.message,
                redirectUrl: `/professional/pickup/${booking._id}`,
            });

            // Socket Notification
            io.to(professional.userId._id.toString()).emit(
                "pickupRequest",
                {
                    bookingId: booking._id,
                    notification,
                    customerName,
                    serviceName: service.name,
                    taskName: task.name,
                    distanceInKm: item.distanceInKm,
                    workDate,
                    workTime,
                }
            );
        }

        // STEP-8
        // Next Part

        return res.status(200).json({
            success: true,
            message: "Searching nearby professionals...",
            searching: true,
            booking,
        });
    } catch (error) {
        console.error("Pickup Booking Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while searching professionals.",
        });
    }
};
