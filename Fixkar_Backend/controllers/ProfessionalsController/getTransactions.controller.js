import { Wallet } from "../../models/walletModel.js";
import { WalletTransaction } from "../../models/walletTransactionModel.js";

export const getTransaction = async (req,res)=>{
    try {
        const {proId} = req.params;
        if(!proId){
            return res.status(400).json({
                message : "Professional Id required!"
            })
        }
        console.log(proId)
        const wallet = await Wallet.findOne({professionalId : proId});
        
        if(!wallet){
            return res.status(404).json({
                message : "wallet not found!"
            })
        }

        console.log(wallet);

        const transactions = await WalletTransaction.find({walletId : wallet._id});
        
        return res.status(200).json({
            transactions
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}