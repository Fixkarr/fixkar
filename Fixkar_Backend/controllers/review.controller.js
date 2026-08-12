import { Booking } from '../models/bookingModel.js'
import { Review } from '../models/reviewModel.js'
import { Customer, Professional } from '../models/userModel.js'
import { io } from '../server.js'

export const postReview = async (req, res) => {
    try {
        const { rating, review, bookingId } = req.body;
        const numericRating = Number(rating);
        const reviewText = typeof review === 'string' ? review.trim() : '';

        if (!bookingId || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5 || !reviewText) {
            return res.status(400).json({
                message: 'A valid booking, rating (1-5), and review are required'
            });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found!'
            });
        }

        const customer = await Customer.findOne({ userId: req.userId }).select('_id');
        if (!customer || booking.customerId.toString() !== customer._id.toString()) {
            return res.status(403).json({
                message: 'You can only review your own booking'
            });
        }

        if (booking.status !== 'completed') {
            return res.status(400).json({
                message: 'A review can only be posted after the booking is completed'
            });
        }

        if (booking.review) {
            return res.status(400).json({
                message: 'A review has already been posted for this booking'
            });
        }

        const existingReview = await Review.findOne({ bookingId: booking._id }).select('_id');
        if (existingReview) {
            return res.status(400).json({
                message: 'A review has already been posted for this booking'
            });
        }

        const professional = await Professional.findById(booking.professionalId);
        if (!professional) {
            return res.status(404).json({
                message: 'Professional not found'
            });
        }

        const newReview = await Review.create({
            bookingId: booking._id,
            professionalId: booking.professionalId,
            customerId: booking.customerId,
            customerName: booking.customerName,
            rating: numericRating,
            review: reviewText,
        });

        const bookingUpdate = await Booking.updateOne(
            { _id: booking._id, review: null, status: 'completed' },
            { $set: { review: newReview._id } }
        );

        if (bookingUpdate.modifiedCount !== 1) {
            await Review.findByIdAndDelete(newReview._id);
            return res.status(409).json({
                message: 'A review has already been posted for this booking'
            });
        }

        professional.reviews.push(newReview._id);
        await professional.save();

        const populatedBooking = await Booking.findById(booking._id).populate({
            path: 'customerId',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'fullName',
            },
        }).populate({
            path: 'professionalId',
            select: 'profilePicture address userId profession',
            populate: [{
                path: 'userId',
                model: 'User',
                select: 'fullName',
            },
            { path: 'profession', select: 'name image skills', populate: { path: 'skills', select: 'name' } },
            { path: 'selectedSkills', select: 'name' }]
        }).populate('review');

        io.to(populatedBooking.customerId.userId._id.toString()).emit(
            'bookingUpdated',
            populatedBooking
        );
        io.to(populatedBooking.professionalId.userId._id.toString()).emit(
            'bookingUpdated',
            populatedBooking
        );

        return res.status(200).json({
            message: 'Review posted!'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error!'
        });
    }
};
