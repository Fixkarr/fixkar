import { ServiceRequest } from "../../../models/serviceRequest.js";
import { Service } from "../../../models/serviceModel.js";
import { Professional } from "../../../models/userModel.js";

export const updateServiceRequest = async (req,res)=>{
    try {
          const admin = req.admin;
            if (!admin) {
              return res.status(401).json({ message: "Unauthorized" });
            }
        

        const {adminNote, status, newServiceId} = req.body;
        const {serviceRequestId} = req.params;

       if (status === "approved") {
    if (!newServiceId) {
        return res.status(400).json({
            message: "newServiceId is required when status is approved!"
        });
    }

    const service = await Service.findById(newServiceId);

    if (!service) {
        return res.status(404).json({
            message: "Selected service not found!"
        });
    }
}

        if(!adminNote || !status){
            return res.status(400).json({
                message : "adminNote and Status are required!"
            })
        }

        if(!serviceRequestId){
            return res.status(400).json({
                message : "serviceRequestId is required!"
            })
        }

        const serviceRequest = await ServiceRequest.findById(serviceRequestId);
        if(!serviceRequest){
            return res.status(404).json({
                message : "Service Request not found!"
            })
        }

        serviceRequest.adminNote = adminNote?.trim() || "";
        serviceRequest.status = status;
        await serviceRequest.save();

        if (serviceRequest.status === "approved") {
            const professional = await Professional.findById(serviceRequest.professional);
            professional.profession = newServiceId;
            await professional.save();
        }
        
        res.status(200).json({
            message : "Service Request updated",
            serviceRequest
        })
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}