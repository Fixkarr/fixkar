import {Booking} from '../models/bookingModel.js'
import { Review } from '../models/reviewModel.js'
import { io } from '../server.js'
export const postReview = async(req,res)=>{
    try {
        const {rating, review, bookingId} = req.body
        if(!rating, !review){
            return res.status(400).json({
                message : "Ratings and Reviews are required"
            })
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
            select: "profilePicture address userId",
            populate: {
            path: "userId",
            model: "User",
            select: "fullName",
            },
        }).populate('review');

        if(!booking){
            return res.status(400).json({
                message : "Booking not found!"
            })
        }

        const newReview = await Review.create({
            bookingId,
            professionalId : booking.professionalId,
            customerId : booking.customerId,
            rating : Number(rating),
            review
        })
        
        booking.review = newReview._id;
        await booking.save();

        io.to(booking.customerId.userId._id.toString()).emit(
            "bookingUpdated",
             booking
        )
        io.to(booking.professionalId.userId._id.toString()).emit(
            "bookingUpdated",
             booking
        )

        res.status(200).json({
            message : "Review posted!"
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message  : "Internal server error!"
        })
    }
}