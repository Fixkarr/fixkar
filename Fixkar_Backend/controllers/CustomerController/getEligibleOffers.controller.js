import { Booking } from '../../models/bookingModel.js';
import { Customer } from '../../models/userModel.js';
import { Offer } from '../Admin/AdminModels/offer.model.js';
import { OfferUsage } from '../Admin/AdminModels/offerUsage.model.js';

export const getEligibleOffers = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.userId;

        if (!bookingId || !userId) {
            return res.status(400).json({
                message: "Booking Id and user Id not found!"
            });
        }

        const customer = await Customer.findOne({ userId }).select("_id");
        if (!customer) {
            return res.status(403).json({ message: "Customer access required" });
        }

        const booking = await Booking.findOne({
            _id: bookingId,
            customerId: customer._id,
        }).populate({
            path: "professionalId",
            select: "profession"
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found!" });
        }

        if (booking.status !== "in-progress") {
            return res.status(400).json({
                message: "invalid status!"
            });
        }

        if (!booking.quoteAmount) {
            return res.status(400).json({
                message: "Quote not sent yet"
            });
        }

        const now = new Date();
        const offers = await Offer.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        });

        if (!offers.length) {
            return res.status(200).json({ offers: [] });
        }

        const userUsages = await OfferUsage.find({
            userId: userId
        }).select("offerId");

        const userUsageMap = new Map();
        userUsages.forEach((u) => {
            const key = u.offerId.toString();
            userUsageMap.set(key, (userUsageMap.get(key) || 0) + 1);
        });

        const completedCount = await Booking.countDocuments({
            customerId: customer._id,
            status: "completed"
        });

        const eligibleOffers = [];

        for (const offer of offers) {
            if (
                offer.serviceId.length &&
                !offer.serviceId
                    .map(id => id.toString())
                    .includes(booking.professionalId.profession.toString())
            ) {
                continue;
            }

            if (
                offer.minBookingAmount &&
                booking.quoteAmount < offer.minBookingAmount
            ) {
                continue;
            }

            if (
                offer.usageLimit &&
                offer.usedCount >= offer.usageLimit
            ) {
                continue;
            }

            const userUsageCount = userUsageMap.get(offer._id.toString()) || 0;
            if (
                offer.perUserLimit &&
                userUsageCount >= offer.perUserLimit
            ) {
                continue;
            }

            if (offer.newCustomerOnly && completedCount > 0) {
                continue;
            }

            let discount = 0;
            const baseAmount = Number(booking.quoteAmount) + Number(booking.visitingCharge || 0);

            if (offer.discountType === "percentage") {
                discount = (baseAmount * Number(offer.discountValue)) / 100;
                if (offer.maxDiscount) {
                    discount = Math.min(discount, Number(offer.maxDiscount));
                }
            } else {
                discount = Number(offer.discountValue);
            }

            if (!Number.isFinite(discount) || discount <= 0 || discount >= baseAmount) {
                continue;
            }

            eligibleOffers.push({
                offerId: offer._id,
                title: offer.offerTitle,
                discount,
                finalPayable: baseAmount - discount
            });
        }

        return res.status(200).json({
            success: true,
            offers: eligibleOffers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch eligible offers"
        });
    }
};
