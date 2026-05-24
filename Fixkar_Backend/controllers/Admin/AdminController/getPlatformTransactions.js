import { PlatformTransaction } from "../AdminModels/platformTransaction.js";

export const getPlatformTransactions = async (req,res)=>{
    try {
        const admin = req.admin;
        if(!admin){
            return res.status(400).json({
                message : "Unauthorized!"
            })
        }

        const platformTransactions = await PlatformTransaction.find();
        if(platformTransactions.length <= 0){
            return res.status(400).json({
                message : "No any Transaction"
            })
        }

        return res.status(200).json({
            message : "Platform Transactions Fetched!",
            platformTransactions
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}