import { ServiceRequest } from '../../models/serviceRequest.js';
import {Professional} from '../../models/userModel.js'

export const getServiceRequest = async (req,res)=>{
    try {
        const {professionalId} = req.body;
        if(!professionalId){
            return res.status(400).json({
                message : "ProfessionalId is required!"
            })
        }

        const professional = await Professional.findById({professionalId});
        if(!professional){
             return res.status(400).json({
                message : "professional not found!"
            })
        }

        const serviceRequest = await ServiceRequest.findOne({professional : professionalId});
        if(!serviceRequest){
            return res.status(400).json({
                message : "service is not requested!"
            })
        }

        return res.status(200).json({
            message : "service requested found!",
            serviceRequest
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}