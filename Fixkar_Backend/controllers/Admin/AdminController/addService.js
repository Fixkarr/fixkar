import { Service } from "../../../models/serviceModel.js";
import { Skill } from "../../../models/skillsModel.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";

export const addService = async (req,res)=>{
    try {
        const {name,description, skills, commission} = req.body;
        const admin = req.admin;
        if(!name || !description || !commission){
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
            commission
            });

    let skillIds = [];

    if (skills && Array.isArray(skills) && skills.length > 0) {
      const skillDocs = await Promise.all(
        skills.map((skillName) =>
          Skill.create({
            name: skillName.trim(),
            service: service._id,
          })
        )
      );

      skillIds = skillDocs.map((skill) => skill._id);
    }

    // 6️⃣ Update service with skill references
    service.skills = skillIds;
    await service.save();

  

    // 7️⃣ Send populated response
    const populatedServices = await Service.find()
      .populate("skills")
      .populate("createdBy", "name email");

            

            return res.status(201).json({
                success: true,
                message: "Service added successfully",
                services : populatedServices,
            });

    } catch (error) {
                console.error("Add Service Error:", error);
                return res.status(500).json({
                success: false,
                message: "Something went wrong while adding service",
                });
    }
}