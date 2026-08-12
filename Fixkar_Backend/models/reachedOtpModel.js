import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    otp: { type: String, required: true },
    attempts: { type: Number, default: 0, min: 0 },
    expiresAt: { type: Date, required: true },
}, {timestamps : true});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ReachedOtp = mongoose.model('ReachedOtp', otpSchema);
