import {Professional} from '../../models/userModel.js'
import {Wallet} from '../../models/walletModel.js'

export const getProfessionalWallet = async (req,res)=>{
    try {
        const userId = req.userId;

          const professional = await Professional.findOne({ userId })
      .select(
        "+bankDetails.accountNumber +bankDetails.holderName +bankDetails.ifsc"
      );


        const wallet = await Wallet.findOne({professionalId : professional._id});

       
  let maskedAccountNumber = null;

    if (professional?.bankDetails?.accountNumber) {
      const acc = professional.bankDetails.accountNumber;
      maskedAccountNumber = "XXXXXX" + acc.slice(-4);
    }

    const safeBankDetails = professional?.bankDetails
      ? {
          holderName: professional.bankDetails.holderName,
          ifsc: professional.bankDetails.ifsc,
          accountNumber: maskedAccountNumber,
        }
      : null;

    if (!wallet) {
      return res.json({
        pendingBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        bankDetails: safeBankDetails,
      });
    }

    const data = { wallet,
      bankDetails: safeBankDetails,
    }

    res.json(data);

    } catch (error) {
        res.status(500).json({ message: "Internal server error!" });
    }
}