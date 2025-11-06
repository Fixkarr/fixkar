import { Professional } from "../../models/userModel.js";


export const getAllProfessionals = async (req,res)=>{
    try {
        const professionals = await Professional.find().populate("userId");
        res.status(200).json({
            messagge : "success",
            user : professionals
        })
    } catch (error) {
        console.log("error in getAllProfessionals");
        res.status(500).json({message : "internal server error"})
    }
}


export const getAllVerifiedProfessionals = async (req,res)=>{
    try {
        const verifiedProfessionals = await Professional.find({status : "approved"}).populate("userId")
        if(!verifiedProfessionals){
            return res.status(404).json({message: "Professionals Not Found"})
        }

        res.status(200).json({message : "success", verifiedProfessionals})
    } catch (error) {
            console.log("error in getAllVerifiedProfessionals", error)
            res.status(500).json({
                message : "internal server error"
            })
    }
}