import { Booking } from "../../models/bookingModel.js";
import { Customer, Professional } from "../../models/userModel.js";
import { WalletTransaction } from "../../models/walletTransactionModel.js";

export const getWalletTransaction = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({
                message: "BookingId not found!"
            });
        }

        const booking = await Booking.findById(bookingId).select("customerId professionalId profession customerName status");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found!" });
        }

        const [customer, professional] = await Promise.all([
            Customer.findOne({ userId: req.userId }).select("_id"),
            Professional.findOne({ userId: req.userId }).select("_id"),
        ]);

        const isCustomerOwner = customer && booking.customerId.toString() === customer._id.toString();
        const isProfessionalOwner = professional && booking.professionalId && booking.professionalId.toString() === professional._id.toString();

        if (!isCustomerOwner && !isProfessionalOwner) {
            return res.status(403).json({ message: "You are not authorized to view this transaction" });
        }

        const transaction = await WalletTransaction.findOne({ bookingId })
            .populate("bookingId", "profession customerName status");

        return res.json({ transaction });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch transaction" });
    }
};
