import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    bookingId : {type : mongoose.Schema.Types.ObjectId, ref : "Booking", required : true},
    customerId : {type : mongoose.Schema.Types.ObjectId, ref : "Customer", required : true},
    professionalId : {type : mongoose.Schema.Types.ObjectId, ref : "Professional", required : true},
    paymentType : {type : String, enum : ["FINAL", "CANCEL"]},
    amount : {
        type : Number,
        required : true
    },
    reason : {type : String},
    currency : {type : String, default : "INR"},
    razorpayOrderId : {type : String, },
    razorpayPaymentId : {type : String},
    status : {type : String, enum : ["created", "paid", "failed", "cancelled", "refunded"], default : 'created'},
    paidAt : {type : Date},
    paymentMode : {type : String, enum : ["ONLINE", "CASH"]} 
},{timestamps : true})

export const Payment = mongoose.model("Payment", paymentSchema);