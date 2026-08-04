import { Service } from "../../../models/serviceModel.js";
import { Skill } from "../../../models/skillsModel.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";

export const addService = async (req, res) => {
  try {
    const {
      name,
      description,
      commission,
      serviceType,
    } = req.body;

    const admin = req.admin;

    if (!name || !description || !commission || !serviceType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Service image is required.",
      });
    }

    // Duplicate Service Check
    const existingService = await Service.findOne({
      name: name.trim(),
    });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "Service already exists.",
      });
    }

    // Parse Skills
    let parsedSkills = [];

    if (serviceType === "skill_based") {
      parsedSkills = JSON.parse(req.body.skills || "[]");

      if (!parsedSkills.length) {
        return res.status(400).json({
          success: false,
          message: "Please add at least one task.",
        });
      }
    }

    // Upload Image
    const uploadedImage = await uploadToCloudinary(
      req.file,
      "services"
    );

    // Create Service
    const service = await Service.create({
      name: name.trim(),
      description: description.trim(),
      image: uploadedImage.secure_url,
      commission,
      serviceType,
      createdBy: admin._id,
    });

    let skillIds = [];

    // Create Tasks / Skills
    if (serviceType === "skill_based") {
      const createdSkills = await Promise.all(
        parsedSkills.map((task) =>
          Skill.create({
            name: task.name.trim(),
            bookingType: task.bookingType,
            fixedPrice:
              task.bookingType === "fixed"
                ? task.fixedPrice
                : null,
            service: service._id,
          })
        )
      );

      skillIds = createdSkills.map((item) => item._id);
    }

    service.skills = skillIds;

    await service.save();

    const services = await Service.find()
      .populate("skills")
      .populate("createdBy", "name email");

    return res.status(201).json({
      success: true,
      message: "Service added successfully.",
      services,
    });
  } catch (error) {
    console.error("Add Service Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding service.",
    });
  }
};