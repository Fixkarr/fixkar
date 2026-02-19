import {Booking} from '../../models/bookingModel.js'
import { Offer } from '../Admin/AdminModels/offer.model.js';
import { OfferUsage } from '../Admin/AdminModels/offerUsage.model.js';

export const getEligibleOffers = async(req,res)=>{
    try {
        const {bookingId} = req.params;
        const userId = req.userId;

    
        if(!bookingId || !userId){
            return res.status(400).json({
                message : "Booking Id and user Id not found!"
            })
        }

        const booking = await Booking.findById(bookingId).populate({
            path : "professionalId",
            select : "profession"
        });
        if(!booking){
            return res.status(400).json({
                message : "Booking not found!"
            })
        }

            if(booking.status !== "in-progress"){
                return res.status(400).json({
                    message : "invalid status!"
                })
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
                userId
                }).select("offerId");

                
                 const userUsageMap = new Map();
                userUsages.forEach(u => {
                userUsageMap.set(
                    u.offerId.toString(),
                    (userUsageMap.get(u.offerId.toString()) || 0) + 1
                );
                });

    // 4️⃣ Get completed booking count once
                const completedCount = await Booking.countDocuments({
                customerId: booking.customerId,
                status: "completed"
                });

                 const eligibleOffers = [];

        for (let offer of offers) {

      // 🔹 Service Match
      if (
        offer.serviceId.length &&
        !offer.serviceId
          .map(id => id.toString())
          .includes(
            booking.professionalId.profession.toString()
          )
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

          const userUsageCount =
        userUsageMap.get(offer._id.toString()) || 0;

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

      if (offer.discountType === "percentage") {
        discount =
          ((booking.quoteAmount + booking.visitingCharge) * offer.discountValue) / 100;

        if (offer.maxDiscount) {
          discount = Math.min(discount, offer.maxDiscount);
        }
      } else {
        discount = offer.discountValue;
      }

       if (discount <= 0) continue;

      eligibleOffers.push({
        offerId: offer._id,
        title: offer.offerTitle,
        discount,
        finalPayable:(booking.quoteAmount + booking.visitingCharge)   - discount
      });

      
    }

     return res.status(200).json({
      success: true,
      offers: eligibleOffers
    });


    } catch (error) {
          console.error(error);
            res.status(500).json({
            message: "Failed to fetch eligible offers"
            });
    }
}