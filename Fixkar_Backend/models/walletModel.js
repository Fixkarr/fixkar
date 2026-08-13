
import mongoose from 'mongoose'

const walletSchema = new mongoose.Schema({
    professionalId : {type : mongoose.Schema.Types.ObjectId, ref : "Professional", required : true},
    pendingBalance : {type : Number, default : 0},
    totalEarned : {type : Number, default : 0},
    totalWithdrawn : {type : Number, default : 0},
    cashPlatformFeeDue: {
    type: Number,
    default: 0,
    min: 0
    },
    credits: {
        balance: { type: Number, default: 0, min: 0 },
        lifetimeEarned: { type: Number, default: 0, min: 0 },
        lifetimeSpent: { type: Number, default: 0, min: 0 },
        lifetimeExpired: { type: Number, default: 0, min: 0 },
        firstBookingRewarded: { type: Boolean, default: false }
    },
    withdrawnRequest : {
        amount : {type : Number, default : 0},
        pending : {type : Boolean, default : false}
    }
},{timestamps : true})

export const Wallet = mongoose.model("Wallet", walletSchema);
