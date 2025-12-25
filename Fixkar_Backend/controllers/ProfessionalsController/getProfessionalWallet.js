import {Professional} from '../../models/userModel.js'
import {Wallet} from '../../models/walletModel.js'

export const getProfessionalWallet = async (req,res)=>{
    try {
        const userId = req.userId;
        const professional = await Professional.findOne({userId})

        const wallet = await Wallet.findOne({professionalId : professional._id});

       

        if(!wallet){
            return res.json({
            pendingBalance: 0,
            totalEarned: 0,
            totalWithdrawn : 0
        })}
        res.json({wallet});
    } catch (error) {
        res.status(500).json({ message: "Internal server error!" });
    }
}