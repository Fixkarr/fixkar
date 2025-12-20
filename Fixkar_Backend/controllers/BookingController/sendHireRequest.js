import { Booking } from "../../models/bookingModel.js";
import { Customer } from "../../models/userModel.js";

export const sendHireRequest = async (req, res)=>{
    try {
        const {professionalId, profession, workDate, workTime, mobileNumber, problemDescription, visitingCharge, workAddress, distanceInKm, chargeType, customerName} = req.body;

        const myId = req.userId;
        const customerId = await Customer.findOne({userId : myId}).select('_id');
     
        const newBooking = new Booking({
            customerId ,
            customerName,
            professionalId, 
            profession,
            workDate,
            workTime,
            problemDescription,
            visitingCharge,
            workAddress,
            distanceInKm,
            chargeType,
            mobileNumber
        })

        await newBooking.save();

        res.status(200).json({
            success : true,
            message : "Hire request sent successfully",
        })


    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message : "Internal server error, please try again",
        })
    }
}