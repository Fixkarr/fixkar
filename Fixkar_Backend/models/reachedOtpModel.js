import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    bookingId : {type : mongoose.Schema.Types.ObjectId, ref : 'Booking', required : true},
    otp : {type : String, required : true},
}, {timestamps : true});

export const ReachedOtp = mongoose.model('ReachedOtp', otpSchema);