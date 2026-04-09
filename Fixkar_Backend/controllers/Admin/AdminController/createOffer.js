import { Offer } from "../AdminModels/offer.model.js";

export const createOffer = async (req, res)=>{
    try {
        const admin = req.admin;
        if(!admin){
            return res.status(401).json({message : "Unauthorized"})
        }

        const {serviceId, offerTitle, discountType, discountValue, minBookingAmount, maxDiscount, startDate, endDate, usageLimit, perUserLimit, newCustomerOnly, isActive} = req.body;
        if(!offerTitle || !discountType || !discountValue){
            return res.status(400).json({message : "Please provide all required fields"})
        }

        const newOffer = new Offer({
            serviceId,
            offerTitle,
            discountType,
            discountValue,
            minBookingAmount,
            maxDiscount,
            startDate,
            endDate,
            usageLimit,
            perUserLimit,
            newCustomerOnly,
            isActive
        });
        await newOffer.save();
        res.status(201).json({message : "Offer created successfully", offer : newOffer})

    } catch (error) {
        console.error("CREATE OFFER ERROR:", error);
        res.status(500).json({ message: "Failed to create offer" });
    }
}