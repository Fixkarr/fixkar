import { Service } from "../../../models/serviceModel.js";
import { Skill } from "../../../models/skillsModel.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";
import {Professional} from '../../../models/userModel.js'

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    let { name, description, skills, commission, serviceType } = req.body;
    const admin = req.admin;

    // 1️⃣ Find service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // 2️⃣ Duplicate name check (ignore same service)
    if (name && name.trim() !== service.name) {
      const duplicate = await Service.findOne({
        name: name.trim(),
        _id: { $ne: serviceId },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Service with this name already exists",
        });
      }
    }

    // 3️⃣ Update basic fields
    if (name) service.name = name.trim();
    if (description) service.description = description;
    if (commission) service.commission = commission;
    if (serviceType && ["skill_based", "specialized"].includes(serviceType)) service.serviceType = serviceType;
    if (typeof skills === "string") skills = JSON.parse(skills || "[]");

    // 4️⃣ Update image (optional)
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file,
        "services"
      );
      service.image = uploadedImage.secure_url;
    }

    // 5️⃣ Update skills (REPLACE MODE)
    if (skills && Array.isArray(skills)) {
      // 🔥 delete old skills
      await Skill.deleteMany({ service: service._id });

      // 🔥 create new skills
      const skillDocs = await Promise.all(
        skills.map((task) =>
          Skill.create({
            name: task.name.trim(),
            service: service._id,
            bookingType: service.serviceType === "specialized" ? "fixed" : task.bookingType,
            pricingSource: service.serviceType === "specialized" ? "professional" : "admin",
            fixedPrice: service.serviceType === "skill_based" && task.bookingType === "fixed" ? Number(task.fixedPrice) : null,
          })
        )
      );

      service.skills = skillDocs.map((s) => s._id);
    }

    // 6️⃣ Save service
    await service.save();

    await Professional.updateMany(
  { profession: service._id },
  { $set: { selectedSkills: [] } }
);

    // 7️⃣ Send updated list (same as addService)
    const populatedServices = await Service.find()
      .populate("skills")
      .populate("createdBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      services: populatedServices,
    });
  } catch (error) {
    console.error("Update Service Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating service",
    });
  }
};
