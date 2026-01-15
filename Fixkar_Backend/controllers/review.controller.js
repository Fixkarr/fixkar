import {Booking} from '../models/bookingModel.js'
import { Review } from '../models/reviewModel.js'
import { Professional } from '../models/userModel.js'
import { io } from '../server.js'
export const postReview = async(req,res)=>{
    try {
        const {rating, review, bookingId} = req.body
        if(!rating, !review){
            return res.status(400).json({
                message : "Ratings and Reviews are required"
            })
        }

        const booking = await Booking.findById(bookingId)

        if(!booking){
            return res.status(400).json({
                message : "Booking not found!"
            })
        }

        const newReview = await Review.create({
            bookingId,
            professionalId : booking.professionalId,
            customerId : booking.customerId,
            customerName : booking.customerName,
            rating : Number(rating),
            review
        })

        const professional = await Professional.findById(booking.professionalId);
        if(!professional){
            return res.status(400).json({
                message : "professional not found"
            })
        }
        professional.reviews.push(newReview)

        await professional.save();
        
        booking.review = newReview._id;
        await booking.save();

        const populatedBooking = await Booking.findById(booking._id).populate({
    path: "customerId",
    populate: {
      path: "userId",
      model: "User",
      select: "fullName",
    },
  }).populate({
    path: "professionalId",
    select: "profilePicture address userId",
    populate: {
      path: "userId",
      model: "User",
      select: "fullName",
    },
  }).populate({
    path: "review",
    populate: {
      path: "customerId",
      populate: {
        path: "userId",
        select: "fullName",
      },
    },
  }).populate({
    path : "profession",
    select : "name image skills",
    populate : {
      path : "skills",
      select : "name"
    }
  }).populate({
    path : "selectedSkills",
    select : "name"
  });
  
        io.to(populatedBooking.customerId.userId._id.toString()).emit(
            "bookingUpdated",
             populatedBooking
        )
        io.to(populatedBooking.professionalId.userId._id.toString()).emit(
            "bookingUpdated",
             populatedBooking
        )

        res.status(200).json({
            message : "Review posted!"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message  : "Internal server error!"
        })
    }
}