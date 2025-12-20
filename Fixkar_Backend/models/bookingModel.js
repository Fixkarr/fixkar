
import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    customerId : {type : mongoose.Schema.Types.ObjectId, ref : "Customer", required : true},
    customerName : {type : String, required : true},
    professionalId : {type : mongoose.Schema.Types.ObjectId, ref : "Professional", required : true},
    profession : {type  : String, required : true},
    workDate : {type : String, required : true},
    workTime : {type : String, required : true},
    chargeType : {type : String, required : true},
    problemDescription : {type : String, required : true},
    visitingCharge : {type : Number, required : true},
    workAddress : {type : String, required : true},
    distanceInKm : {type : Number, required : true},
    mobileNumber : {type : String, required : true},
    status : {
        type : String,
        enum : ['pending', 'accepted', 'in-progress', "rejected", 'completed', 'cancelled'],
        default : 'pending'
    },
},{timestamps : true})

export const Booking = mongoose.model("Booking", bookingSchema);