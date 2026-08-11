import mongoose from "mongoose";
import { Service } from "../../../models/serviceModel.js";
import { Skill } from "../../../models/skillsModel.js";
import { Professional } from "../../../models/userModel.js";

export const deleteService = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { serviceId } = req.params;

    if (!mongoose.isValidObjectId(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    session.startTransaction();

    const service = await Service.findById(serviceId).session(session);

    if (!service) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Never delete a service that is already assigned to a professional.
    const professionalExists = await Professional.exists({
      profession: service._id,
    }).session(session);

    if (professionalExists) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: "This service cannot be deleted because professionals are assigned to it.",
      });
    }

    // Delete every task/skill belonging to this service first.
    const skillDeleteResult = await Skill.deleteMany({
      service: service._id,
    }).session(session);

    await Service.deleteOne({
      _id: service._id,
    }).session(session);

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      deletedServiceId: service._id,
      deletedSkills: skillDeleteResult.deletedCount,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Delete Service Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the service",
    });
  } finally {
    await session.endSession();
  }
};
