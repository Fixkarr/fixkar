import mongoose from "mongoose";
import { Notification } from "../models/notificationModel.js";
import { io } from "../server.js";
import { findEligibleProfessionals } from "./matchingEngine.js";
import { calculateDistanceForProfessionals } from "./calculateDistanceForProfessionals.js";
import { pushNotification } from "./pushNotification.js";
import { PickupRequest } from "../models/pickup.model.js";
import { PickupSession } from "../models/pickupSession.model.js";

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
        // STEP-1
        // Find eligible professionals
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
                success: false,
                message: "No professionals are available nearby.",
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
                success: false,
                message: "No nearby professionals found.",
            });
        }

        // STEP-3
        // Sort by actual road distance
        nearbyProfessionals.sort(
            (a, b) => a.distanceInKm - b.distanceInKm
        );

        // STEP-4
        // Only nearest 5 professionals
        const topProfessionals =
            nearbyProfessionals.slice(0, 5);
        // STEP-5
        // Create one unique pickup session
        // All professional requests belong to this session
        const professionalExpiresAt = new Date(
            Date.now() + 60 * 1000
            );

            const pickupSession = await PickupSession.create({
            customerId,
            status: "searching",
            professionalExpiresAt,
            });
        // Customer gets 60 seconds to find a professional
      
        // STEP-6
        // Send pickup request to nearest professionals
            const pickupSessionId = pickupSession._id;
    
        const calculateVisitingCharge = (distanceInKm) => {
    const distance = Number(distanceInKm);
    if (distance <= 10) {
        return 25;
    }
    return Math.round(
        distance + (distance - 5) * 3
    );
};

        for (const item of topProfessionals) {
            const professional = item.professional;
                const taskPrice = task.pricingSource === "admin"
        ? Number(task.fixedPrice)
        : Number(
            professional.taskPricing?.find(
                (rate) =>
                    rate.skill?.toString() ===
                    task._id.toString()
            )?.price
        );
        const visitingCharge =
    service.serviceType === "specialized"
        ? Number(professional.visitingCharge || 0)
        : calculateVisitingCharge(item.distanceInKm);

        const totalAmount =
    taskPrice + visitingCharge;

            // Create pickup request
            const pickupRequest = await PickupRequest.create({
                pickupSessionId: pickupSession._id,
                // Booking does NOT exist yet
                bookingId: null,
                customerName,
                serviceName: service.name,
                taskName: task.name,
                charge : {
                         taskPrice,
                        visitingCharge,
                        totalAmount,
                    },
                
                professionalId: professional._id,
                customerId,
                distanceInKm: item.distanceInKm,
                durationInMinutes: item.durationValue,
                attemptNo: 1,
                status: "pending",
                expiresAt : professionalExpiresAt,
                notificationSent: false,
                socketDelivered: false,
                customerLocation: {
                    customerLat: Number(customerLat),
                    customerLng: Number(customerLng),
                },
                customerMobileNumber: Number(mobileNumber),
                workDate,
                workTime,
                problemDescription,
                workAddress,
                audioMessages,
            });

            // Notification
            const notification = await Notification.create({
                userId: professional.userId._id,
                title: "New Pickup Request",
                message: `${customerName} needs a ${service.name}.`,
                type: "pickup_request",
                relatedId: pickupSessionId,
                isRead: false,
            });

            // Push notification
            await pushNotification({
                userId: professional.userId._id,
                title: notification.title,
                message: notification.message,
                redirectUrl: `/professional/pickup`,
            }); 

            // Socket notification
            io.to(
                professional.userId._id.toString()
            ).emit(
                "pickupRequest",
                {
                    pickupRequestId: pickupRequest._id,
                    pickupSessionId,
                    customerName,
                    serviceName: service.name,
                    taskName: task.name,
                    distanceInKm: item.distanceInKm,
                    durationInMinutes: item.durationValue,
                    workDate,
                    workTime,
                    expiresAt : professionalExpiresAt,
                    customerLocation : {
                        customerLat: Number(customerLat),
                        customerLng: Number(customerLng),
                    },
                    mobileNumber,
                    workAddress,
                    charge : {
                         taskPrice,
                        visitingCharge,
                        totalAmount,
                    },
                    problemDescription,
                    audioMessages,
                }
            );

            // Mark delivery information
            await PickupRequest.findByIdAndUpdate(
                pickupRequest._id,
                {
                    notificationSent: true,
                    socketDelivered: true,
                }
            );
        }

        // STEP-7
        // Send response to customer
        return res.status(200).json({
            success: true,
            message: "Searching nearby professionals...",
            searching: true,
            pickupSessionId,
            expiresAt : professionalExpiresAt,
            professionalsNotified:
                topProfessionals.length,
        });

    } catch (error) {
        console.error(
            "Pickup Booking Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Something went wrong while searching professionals.",
        });
    }
};