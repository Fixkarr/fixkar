import { Wallet } from "../../../models/walletModel.js";

export const getWithdrawnRequests  = async (req,res)=>{
    try {
        const admin = req.admin;
        if(!admin){
            return res.status(400).json({
                message : "Unauthorized!"
            })
        }
        const walltes = await Wallet.find({
             "withdrawnRequest.pending": true
        }).populate({
    path: "professionalId",
    select: "userId profession",
    populate: [{
      path: "userId",
      model: "User",
      select: "fullName",
    },
  { path: "profession", select: "name"},
],
  }).sort({ updatedAt: -1 });

        if(walltes.length == 0){
            return res.status(200).json({
                message : "No Withdrawal requests found!"
            })
        }

        const requests = walltes?.map(wallet=>({
             professionalId: wallet.professionalId?._id,
             professonalName : wallet.professionalId?.userId?.fullName,
             requestedAmount : wallet.withdrawnRequest.amount,
             pendingBalance : wallet.pendingBalance,
             totalWithdrawn: wallet.totalWithdrawn,
             requestedAt: wallet.updatedAt
        }))

         return res.status(200).json({
            requests
        });


    } catch (error) {
    console.error("getAllWithdrawRequests error:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
    }
}