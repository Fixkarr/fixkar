import { ReachedOtp } from "../../models/reachedOtpModel.js";

export const getReachedOtp = async (req,res)=>{
    try {
        const {bookingId} = req.params; 
        const reachedOtpRecord = await ReachedOtp.findOne({bookingId});

        if(!reachedOtpRecord){
            return res.status(404).json({message: "Reached OTP not found"});
        }

        return res.status(200).json({otp: reachedOtpRecord.otp});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
}