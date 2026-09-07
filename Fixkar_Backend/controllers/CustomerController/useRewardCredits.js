import { Booking } from "../../models/bookingModel.js";
import { io } from "../../server.js";

export const useRewardCredits = async (req,res)=>{
    try {
        const userId = req.userId;
        const {bookingId } = req.body;
        if(!bookingId){
            return res.status(400).json({
                message : "Booking not found"
            }
            )
        }
        const booking = await Booking.findById(bookingId).populate({
    path: "customerId",
    populate: {
      path: "userId",
      model: "User",
      select: "fullName",
    },
  })
  .populate({
    path: "professionalId",
    select: "profilePicture address userId profession, shortCode",
     populate: [{
      path: "userId",
      model: "User",
      select: "fullName",
    },
  { path: "profession", select: "name image skills", populate: { path: "skills", select: "name" } },
    {path : "selectedSkills", select : "name"}
]
  }).populate('review')

  if (!booking) {
    return res.status(404).json({
        message: "Booking not found"
    });
}

     if (booking.status !== "in-progress") {
      return res.status(400).json({
        message: "Invalid booking status"
      });
    }

     if (!booking.quoteAmount) {
      return res.status(400).json({
        message: "Quote not sent yet"
      });
    }

        if(booking.offerLocked){
            return res.status(400).json({
                message : "Offer already applied, cannot use reward credits"
            })
        }

        if (booking.rewardCreditsApplied) {
            return res.status(400).json({
                message: "Reward credits already applied, cannot use offer"
            });
        }

         if (booking.customerId.userId._id.toString() !== userId.toString()) {
                return res.status(403).json({
                    message: "Not authorized"
                });
            }

        const availableRewardCredits = Number(booking.customerId.rewardCredits || 0);

        if(availableRewardCredits <= 0){
            return res.status(400).json({
                message : "No reward credits available"
            })
        }

        const baseAmount =
        Number(booking.quoteAmount || 0) +
        Number(booking.visitingCharge || 0);

        const discountAmount = Math.min(
            availableRewardCredits,
            baseAmount - 1
        );

        const finalPayable = baseAmount - discountAmount;

        if (finalPayable <= 0) {
            return res.status(400).json({
                message: "Invalid final amount"
            });
        }

        booking.finalCustomerPayable = finalPayable;
        booking.discountAmount = discountAmount;
        booking.rewardCreditsApplied = true;
        booking.rewardCreditsAmount = discountAmount;

        await booking.save();

        io.to(booking.customerId.userId._id.toString()).emit(
            "bookingUpdated",
            booking
        );

          io.to(booking.professionalId.userId._id.toString()).emit(
            "bookingUpdated",
            booking
        );

         return res.status(200).json({
      success: true,
       message: "Reward Credits applied!",
      discountAmount,
      finalPayable
    });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message : "Internal server error!"
        })
    }
}