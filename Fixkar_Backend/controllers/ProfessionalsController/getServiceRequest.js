import { ServiceRequest } from '../../models/serviceRequest.js';
import {Professional} from '../../models/userModel.js'

export const getServiceRequest = async (req,res)=>{
    try {
        const userId = req.userId;
        if(!userId){
            return res.status(400).json({
                message : "UserId is required!"
            })
        }

        const professional = await Professional.findOne({userId});
        if(!professional){
             return res.status(400).json({
                message : "professional not found!"
            })
        }

        const serviceRequest = await ServiceRequest.findOne({professional : professional._id});
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