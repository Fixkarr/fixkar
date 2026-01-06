import { Service } from "../../../models/serviceModel.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";

export const addService = async (req,res)=>{
    try {
        const {name,description} = req.body;
        const admin = req.admin;
        if(!name || !description){
            return res.status(400).json({
                message : "All fields are required!"
            })
        }

            if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Service image is required",
            });
            }

             // 2️⃣ Check duplicate service
            const existingService = await Service.findOne({
                name: name.trim(),
            });


              if (existingService) {
            return res.status(409).json({
                success: false,
                message: "Service already exists",
            });
            }

             const uploadedImage = await uploadToCloudinary(
            req.file,
            "services"
            );

            const service = await Service.create({
            name: name.trim(),
            description,
            image : uploadedImage.secure_url,
            createdBy: admin._id, // from adminAuth middleware
            });

            const services = await Service.find();

            return res.status(201).json({
                success: true,
                message: "Service added successfully",
                services,
            });

    } catch (error) {
                console.error("Add Service Error:", error);
                return res.status(500).json({
                success: false,
                message: "Something went wrong while adding service",
                });
    }
}