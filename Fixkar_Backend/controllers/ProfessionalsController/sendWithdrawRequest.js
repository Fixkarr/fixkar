import { Professional } from "../../models/userModel.js";
import { Wallet } from "../../models/walletModel.js";

export const sendWithDrawRequest = async(req,res)=>{
    try {
        const myId = req.userId;
        const {amount} = req.body;
        if(!myId){
            return res.status(400).json({
                message : "Unauthorized!"
            })
        }
        const professional = await Professional.findOne({userId : myId});
        if(!professional){
            return res.status(400).json({
                message : "Professional not found!"
            })
        }

        const isBankVerified =  professional.bankVerified;
        if(!isBankVerified){
            return res.status(400).json({
                message : "Your bank details are not verified yet!"
            })
        }

        const proWallet = await Wallet.findOne({professionalId : professional._id});
        if(!proWallet){
            return res.status(400).json({
                message : "Wallet Not created yet!"
            })
        }
        const {pendingBalance} = proWallet;
        if(amount < 100){
            return res.status(400).json({
                message : "Minimum withdrawal amount is ₹100.6"
            })
        }
        
        if(amount > pendingBalance){
            return res.status(400).json({
                message : `You can withdraw maximum ₹${pendingBalance} only`
            })
         }

         proWallet.withdrawnRequest.amount = amount;
         proWallet.withdrawnRequest.pending = true;
         await proWallet.save();

         return res.status(200).json({
            message : "Withdrawal request sent. Payment processing in progress.",
            amount
         })

    } catch (error) {
        return res.status(500).json({
            message : "Internal server error!"
        })
    }
}