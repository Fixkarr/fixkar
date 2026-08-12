import { Professional } from "../../models/userModel.js";
import { Wallet } from "../../models/walletModel.js";
import { WalletTransaction } from "../../models/walletTransactionModel.js";

export const getTransaction = async (req,res)=>{
    try {
        const {proId} = req.params;
        const requestedLimit = Number(req.query.limit);
        const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
            ? Math.min(Math.floor(requestedLimit), 50)
            : null;
        if(!proId){
            return res.status(400).json({
                message : "Professional Id required!"
            })
        }

        const professional = await Professional.findOne({ userId: req.userId }).select("_id");
        if (!professional || professional._id.toString() !== proId.toString()) {
            return res.status(403).json({ message: "You can only view your own transactions" });
        }

        const wallet = await Wallet.findOne({professionalId : professional._id});
        
        if(!wallet){
            return res.status(404).json({
                message : "wallet not found!"
            })
        }


        let transactionQuery = WalletTransaction.find({walletId : wallet._id}).sort({ createdAt: -1});
        if (limit) transactionQuery = transactionQuery.limit(limit);
        const transactions = await transactionQuery;
        
        
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
