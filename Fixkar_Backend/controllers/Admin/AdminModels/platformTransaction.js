import mongoose from "mongoose";

const platformTransactionSchema = new mongoose.Schema({

    bookingId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Booking"
    },

    paymentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Payment"
    },

    professionalId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Professional"
    },

    paymentMode : {
        type : String,
        enum : ["ONLINE", "CASH"]
    },

    // original service value
    grossAmount : {
        type : Number,
        default : 0
    },

    // customer ne actual kitna diya
    customerPaidAmount : {
        type : Number,
        default : 0
    },

    // offer discount
    discountAmount : {
        type : Number,
        default : 0
    },

    // fixkar earning
    commission : {
        type : Number,
        default : 0
    },

    // professional earning
    professionalAmount : {
        type : Number,
        default : 0
    },

    // final platform profit/loss

    profitOrLoss : {
   type : Number,
   default : 0
}

}, {timestamps : true});

export const PlatformTransaction = mongoose.model(
    "PlatformTransaction",
    platformTransactionSchema
);



