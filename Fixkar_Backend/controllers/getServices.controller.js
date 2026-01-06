import {Service} from "../models/serviceModel.js";

export const getServices = async(req,res)=>{
    try {
        const services = await Service.find();
        res.status(200).json({
            message : "Services fetched successfully",
            services
        });
    } catch (error) {
        res.status(500).json({message : "Internal Server Error"});
    }
}