import {Offer} from "../AdminModels/offer.model.js"

export const updateOfferById = async (req,res)=>{

    try {
        const admin = req.admin;
        if(!admin){
            return res.status(401).json({
                message : "Unauthorized!"
            })
        }
         const {serviceId, offerTitle, discountType, discountValue, minBookingAmount, maxDiscount, startDate, endDate, usageLimit, perUserLimit, newCustomerOnly, isActive} = req.body;
        

        const {offerId} = req.params;
        const offer = await Offer.findById(offerId);
        if(!offer){
            return res.status(404).json({
                message : "Offer not found!"
            })
        }

        offer.serviceId = serviceId ?? offer.serviceId;
    offer.offerTitle = offerTitle;
    offer.discountType = discountType;
    offer.discountValue = discountValue;
    offer.minBookingAmount = minBookingAmount ?? offer.minBookingAmount;
    offer.maxDiscount = maxDiscount ?? offer.maxDiscount;
    offer.startDate = startDate ?? offer.startDate;
    offer.endDate = endDate ?? offer.endDate;
    offer.usageLimit = usageLimit ?? offer.usageLimit;
    offer.perUserLimit = perUserLimit ?? offer.perUserLimit;
    offer.newCustomerOnly = newCustomerOnly ?? offer.newCustomerOnly;
    offer.isActive = isActive ?? offer.isActive;

    await offer.save();
    res.status(200).json({
      message: "Offer updated successfully",
      offer
    });
    } catch (error) {
          console.error("UPDATE OFFER ERROR:", error);
    res.status(500).json({ message: "Failed to update offer" });
    }
}