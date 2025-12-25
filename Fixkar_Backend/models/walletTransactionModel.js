import mongoose from 'mongoose'

const walletTransationSchema = new mongoose.Schema({
    bookingId : {type : mongoose.Schema.Types.ObjectId, ref : "Booking"},
    walletId : {type : mongoose.Schema.Types.ObjectId, ref : "Wallet"},
    grossAmount : {type : Number, default : 0},
    type : {type : String, enum  : ["CREDIT", "DEBIT"]},
    reason : {type : String},
    professionalAmount : {type : Number, default : 0},
    commission : {type : Number, default : 0},
    status : {type : String, enum : ["pending", "comleted"], default : "pending"}
}, {timestamps : true})

export const WalletTransaction = mongoose.model("WalletTransaction", walletTransationSchema)