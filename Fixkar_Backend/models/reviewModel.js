import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    bookingId : {type : mongoose.Schema.Types.ObjectId, ref : 'Booking', required : true},
    professionalId : {type : mongoose.Schema.Types.ObjectId, ref : "Professional", required : true},
    customerId : {type : mongoose.Schema.Types.ObjectId, ref : "Customer", required : true},
    rating : {type : Number, min : 1, max : 5, required : true},
    review : {type : String,  
        trim: true,
        maxlength: 500,
        required : true},
    

},{timestamps : true})

export const Review = mongoose.model('Review', reviewSchema);