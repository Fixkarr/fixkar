
import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    customerId : {type : mongoose.Schema.Types.ObjectId, ref : "Customer", required : true},
    customerName : {type : String, required : true},
    professionalId : {type : mongoose.Schema.Types.ObjectId, ref : "Professional", required : true},

    workDate : {type : String, required : true},
    workTime : {type : String, required : true},
    chargeType : {type : String, required : true},
    problemDescription : {type : String, required : true},
    visitingCharge : {type : Number, required : true},
    workAddress : {type : String, required : true},
    distanceInKm : {type : Number, required : true},
    mobileNumber : {type : String, required : true},
    rejectMessage  : {type : String},
    reachedAt: {
    type: Date,
    default: null
    },
    reachedOTP : {type : String},
    status : {
        type : String,
        enum : ['pending', 'accepted', 'reached', 'in-progress', "rejected", 'completed', 'cancelled'],
        default : 'pending'
    },
    startedAt : {
        type : Date,
    },
    quoteAmount : {
        type : Number
    },
    quoteSentAt : {
        type : Date
    },
    currentPaymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
    },
    completedAt : {
        type : Date
    },
    review : {type : mongoose.Schema.Types.ObjectId, ref : 'Review'}
},{timestamps : true})

export const Booking = mongoose.model("Booking", bookingSchema);