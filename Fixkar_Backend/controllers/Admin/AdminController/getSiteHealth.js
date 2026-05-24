
import { Booking } from "../../../models/bookingModel.js";
import { Service } from "../../../models/serviceModel.js";
import { Professional, User } from "../../../models/userModel.js";

export const getSiteHealth = async (req,res)=>{
    try {
        const admin = req.admin;
        if(!admin){
            return res.status(400).json({
                message : "Admin not found"
            })
        }

        const totalUsers = await User.countDocuments();
        const customers = await User.countDocuments({ role: "customer" });
        const professionals = await User.countDocuments({ role: "professional" });
        const bookings = await Booking.countDocuments();
        const pendingProfessionalApplications = await Professional.countDocuments({ status: "pending" })
        const services = await Service.countDocuments();
         
        const health = {
             totalUsers,
            customers,
            professionals,
            bookings,
            pendingApplications : pendingProfessionalApplications,
            services
        }
       
        return res.status(200).json({  
            health
        })

        
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}