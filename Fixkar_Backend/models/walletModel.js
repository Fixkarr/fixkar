
import mongoose from 'mongoose'

const walletSchema = new mongoose.Schema({
    professionalId : {type : mongoose.Schema.Types.ObjectId, ref : "Professional", required : true},
    balance : {type : Number,
        default : 0
    },
    pendingBalance : {type : Number, default : 0},
    totalEarned : {type : Number, default : 0},
    totalWithdrawn : {type : Number, default : 0}
},{timestamps : true})

export const Wallet = mongoose.model("Wallet", walletSchema);