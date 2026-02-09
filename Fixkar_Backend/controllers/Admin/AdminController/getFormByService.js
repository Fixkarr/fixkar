// import { Form } from "../AdminModels/form.model.js";
import mongoose from "mongoose";
import Form from '../AdminModels/form.model.js'
/* =========================
   GET FORM BY SERVICE
   ========================= */
export const getFormByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        message: "Valid serviceId is required"
      });
    }

    const form = await Form.findOne({
      "target.entity": "service",
      "target.entityId": serviceId,
      isActive: true
    })
      .sort({ version: -1 }) // latest version
      .lean();

    if (!form) {
      return res.status(404).json({
        message: "No form found for this service"
      });
    }

    return res.status(200).json({
      message: "Form fetched successfully",
      form
    });
  } catch (err) {
    console.error("GET FORM BY SERVICE ERROR:", err);

    return res.status(500).json({
      message: "Failed to fetch form"
    });
  }
};
