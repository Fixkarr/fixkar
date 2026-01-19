import { Booking } from "../../../models/bookingModel.js";

export const getBookings = async (req, res) => {
    try {
        const admin = req.admin;
        if (!admin) {
            return res.status(400).json({
                message: "Unauthorized!"
            })
        }

        const bookings = await Booking.find()
        if (!bookings) {
            return res.status(400).json({
                message: "Bookings Not Found"
            })
        }

        return res.status(200).json({
            message: "Mil gaye saare bookings",
            bookings
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error!" })
    }
}


export const getAdminBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const admin = req.admin;
        if (!admin) {
            return res.status(400).json({
                message: "Unauthorized!"
            })
        }

        if (bookingId) {
            return res.status(400).json({
                message: "bookingId is requied!"
            })
        }

        const booking = await Booking.findById(bookingId).populate({
            path: 'customerId', populate: {
                path: 'userId'
            }
        }).populate({
            path: "professionalId",
            populate: [{
                path: "userId",
                model: "User",
            },
            { path: "profession", populate: { path: "skills" } },
            { path: "selectedSkills" },
            { path: 'reviews' },
            { path: 'gallery' },
            { path: 'acceptedBy' },
            ],
        }).populate('currentPaymentId').populate('review');

        if (!booking) {
            return res.status(400).json({
                message: "booking not found"
            })
        }

        return res.status(200).json({
            message: "Ye lo booking aa gayi!"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!"
        })

    }
}