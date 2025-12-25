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
            rating : Number(rating),
            review
        })
        
        res.status(200).json({
            message : "Thank you for your feedback!",
            review : newReview
        })


    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message  : "Internal server error!"
        })
    }
}