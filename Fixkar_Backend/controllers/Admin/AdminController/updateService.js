import { Service } from "../../../models/serviceModel.js";
import { Skill } from "../../../models/skillsModel.js";
import { Professional } from "../../../models/userModel.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";

const parseTasks = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return JSON.parse(value || "[]");
  return [];
};

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, description, commission, serviceType } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    const nextType = serviceType || service.serviceType;
    if (!["skill_based", "specialized"].includes(nextType)) {
      return res.status(400).json({ success: false, message: "Invalid service type" });
    }

    const duplicate = name && await Service.exists({ name: name.trim(), _id: { $ne: service._id } });
    if (duplicate) return res.status(409).json({ success: false, message: "Service with this name already exists" });

    let tasks;
    try { tasks = parseTasks(req.body.skills); }
    catch { return res.status(400).json({ success: false, message: "Tasks data is invalid" }); }
    if (!tasks.length) return res.status(400).json({ success: false, message: "Add at least one task" });

    const normalizedTasks = tasks.map((task) => ({
      _id: task._id,
      name: String(task.name || "").trim(),
      bookingType: nextType === "specialized" ? "fixed" : task.bookingType,
      fixedPrice: nextType === "skill_based" && task.bookingType === "fixed" ? Number(task.fixedPrice) : null,
    }));
    if (normalizedTasks.some((task) => !task.name)) {
      return res.status(400).json({ success: false, message: "Every task needs a name" });
    }
    if (nextType === "skill_based" && normalizedTasks.some((task) =>
      !["fixed", "inspection"].includes(task.bookingType) ||
      (task.bookingType === "fixed" && (!Number.isFinite(task.fixedPrice) || task.fixedPrice < 0))
    )) {
      return res.status(400).json({ success: false, message: "Every fixed task needs a valid price" });
    }

    const existingTasks = await Skill.find({ service: service._id });
    const retainedIds = [];
    for (const task of normalizedTasks) {
      let skill = task._id && existingTasks.find((item) => item._id.toString() === String(task._id));
      if (!skill) skill = existingTasks.find((item) => item.name.toLowerCase() === task.name.toLowerCase());
      const taskData = {
        name: task.name,
        bookingType: task.bookingType,
        pricingSource: nextType === "specialized" ? "professional" : "admin",
        fixedPrice: task.fixedPrice,
        service: service._id,
        isActive: true,
      };
      if (skill) {
        Object.assign(skill, taskData);
        await skill.save();
      } else {
        skill = await Skill.create(taskData);
      }
      retainedIds.push(skill._id);
    }

    // Old tasks are retained for booking history but cannot be newly booked.
    const removedIds = existingTasks
      .filter((skill) => !retainedIds.some((id) => id.toString() === skill._id.toString()))
      .map((skill) => skill._id);
    if (removedIds.length) {
      await Skill.updateMany({ _id: { $in: removedIds } }, { $set: { isActive: false } });
      await Professional.updateMany(
        { profession: service._id },
        { $pull: { selectedSkills: { $in: removedIds }, taskPricing: { skill: { $in: removedIds } } } }
      );
    }

    service.name = name?.trim() || service.name;
    service.description = description?.trim() || service.description;
    if (commission !== undefined && commission !== "") service.commission = Number(commission);
    service.serviceType = nextType;
    service.skills = retainedIds;
    if (req.file) {
      const image = await uploadToCloudinary(req.file, "services");
      service.image = image.secure_url;
    }
    await service.save();

    const services = await Service.find().populate("skills").populate("createdBy", "name email");
    return res.status(200).json({ success: true, message: "Service updated successfully", services });
  } catch (error) {
    console.error("Update Service Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while updating service" });
  }
};
