import { Form } from "../AdminModels/form.model.js";

/* =========================
   CREATE FORM (ADMIN)
   ========================= */
export const createForm = async (req, res) => {
  try {
    const {
      key,
      purpose,
      title,
      description,
      sections,
      target
    } = req.body;

    if (target?.entity === "service" && !target?.entityId) {
  return res.status(400).json({
    message: "Service ID is required when target entity is service"
  });
}

    /* ===== BASIC VALIDATION ===== */
    if (!key || !purpose || !title) {
      return res.status(400).json({
        message: "Form key, purpose and title are required"
      });
    }

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({
        message: "Form must contain at least one section"
      });
    }

    /* ===== UNIQUE KEY CHECK ===== */
    const existing = await Form.findOne({ key });
    if (existing) {
      return res.status(409).json({
        message: "Form with this key already exists"
      });
    }

    /* ===== CLEAN & NORMALIZE SECTIONS ===== */
    const normalizedSections = sections.map((section, sIdx) => {
      if (!section.title) {
        throw new Error(`Section title missing at index ${sIdx}`);
      }

      return {
        sectionId: section.sectionId,
        title: section.title,
        description: section.description || "",
        order: sIdx,
        fields: section.fields.map((field, fIdx) => {
          if (!field.label || !field.type) {
            throw new Error(
              `Invalid field at section ${sIdx}, field ${fIdx}`
            );
          }

          return {
            fieldId: field.fieldId,
            label: field.label,
            helperText: field.helperText || "",
            type: field.type,
            required: !!field.required,

            options: field.options || [],

            validation: {
              min: field.validation?.min ?? null,
              max: field.validation?.max ?? null,
              regex: field.validation?.regex || ""
            },

            ui: field.ui || {},
            summary: field.summary,
            editable: {
              afterSubmit: !!field.editable?.afterSubmit
            }
          };
        })
      };
    });

    /* ===== CREATE FORM ===== */
    const form = await Form.create({
      key,
      purpose,
      title,
      description,
      target: {
        entity: target?.entity || null,
        entityId: target?.entityId || null
      },
      sections: normalizedSections
    });

    return res.status(201).json({
      message: "Form created successfully",
    });
  } catch (err) {
    console.error("CREATE FORM ERROR:", err);

    return res.status(500).json({
      message: err.message || "Failed to create form"
    });
  }
};
