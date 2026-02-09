import { Form } from "../AdminModels/form.model.js";

export const getAllForms = async (req, res) => {
  try {
    const { purpose, entity } = req.query;

    const filter = {};

    // optional filters (admin convenience)
    if (purpose) {
      filter.purpose = purpose;
    }

    if (entity) {
      filter["target.entity"] = entity;
    }

    const forms = await Form.find(filter)
      .sort({ createdAt: -1 }) // latest first

    return res.status(200).json({
      forms
    });
  } catch (err) {
    console.error("FETCH ALL FORMS ERROR:", err);
    return res.status(500).json({
      message: "Failed to fetch forms"
    });
  }
};
