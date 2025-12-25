import { Professional } from "../../models/userModel.js"
import { Wallet } from "../../models/walletModel.js";
import { WalletTransaction } from "../../models/walletTransactionModel.js";

export const getWalletTransaction = async (req, res) => {
    try {
        const professional = req.userId;
        const professionalId = await Professional.findOne({ userId: professional })

        const wallet = await Wallet.findOne({ professionalId : professionalId._id});
        if (!wallet) return res.json([]);

        const transactions = await WalletTransaction.find({
            walletId: wallet._id,
        })
            .sort({ createdAt: -1 })
            .populate("bookingId", "profession customerName status");

        res.json({transactions});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
}