   import { Professional } from "../../models/userModel.js"
    import { Wallet } from "../../models/walletModel.js";
    import { WalletTransaction } from "../../models/walletTransactionModel.js";

    export const getWalletTransaction = async (req, res) => {
        try {
            const bookingId = req.params;
           
            if(!bookingId){
                return res.status(400).json({
                    message : "BookingId not found!"
                })
            }

            const transaction = await WalletTransaction.findOne({
                bookingId,
            }).populate("bookingId", "profession customerName status");

            res.json({transaction});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Failed to fetch transaction" });
        }
    }