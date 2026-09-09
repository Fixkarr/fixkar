import { ServiceRequest } from '../../models/serviceRequest.js';

export const getServiceRequest = async (req,res)=>{
    try {
        const {professionalId} = req.query;
        if(!professionalId){
            return res.status(400).json({
                message : "ProfessionalId is required!"
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