import mongoose from 'mongoose'

const walletTransationSchema = new mongoose.Schema({
    bookingId : {type : mongoose.Schema.Types.ObjectId, ref : "Booking"},
    walletId : {type : mongoose.Schema.Types.ObjectId, ref : "Wallet",  required: true},
    grossAmount : {type : Number, default : 0},
    type : {type : String, enum  : ["CREDIT", "DEBIT"],  required: true},
    reason : {type : String},
    professionalAmount : {type : Number, default : 0},
    commission : {type : Number, default : 0},
    paymentProof : {
        UTR : {type : String},
        mode : {type : String},
        amount : {type : Number},
        transferedAt : {type : Date}
    }
}, {timestamps : true})

export const WalletTransaction = mongoose.model("WalletTransaction", walletTransationSchema)