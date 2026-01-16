import { Service } from "../models/serviceModel.js"

export const getServiceSkills = async (req,res)=>{
    try {
        const {serviceId} = req.params

        if(!serviceId){
            return res.status(400).json({
                message : "serviceId is required"
            })
        }

        const service = await Service.findById(serviceId).populate("skills", "name").select("skills")
          if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
            }
        
            return res.status(200).json({
            success: true,
            skills: service.skills, // 👈 array of skills
            });


    } catch (error) {
             return res.status(500).json({
                success: false,
                message: "Server error",
            });
    }
}