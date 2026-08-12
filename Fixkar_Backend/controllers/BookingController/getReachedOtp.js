import { Booking } from "../../models/bookingModel.js";
import { Customer } from "../../models/userModel.js";
import { ReachedOtp } from "../../models/reachedOtpModel.js";

export const getReachedOtp = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const customer = await Customer.findOne({ userId: req.userId }).select("_id");

        if (!customer) {
            return res.status(403).json({ message: "Customer access required" });
        }

        const booking = await Booking.findOne({
            _id: bookingId,
            customerId: customer._id,
            status: "reached",
        }).select("_id");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found or OTP is not available" });
        }

        const reachedOtpRecord = await ReachedOtp.findOne({ bookingId: booking._id });

        if (!reachedOtpRecord) {
            return res.status(404).json({ message: "Reached OTP not found" });
        }

        if (reachedOtpRecord.expiresAt <= new Date()) {
            await ReachedOtp.deleteOne({ _id: reachedOtpRecord._id });
            return res.status(400).json({ message: "Reached OTP expired" });
        }

        return res.status(200).json({ otp: reachedOtpRecord.otp });
    } catch (error) {
        console.error("getReachedOtp error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
