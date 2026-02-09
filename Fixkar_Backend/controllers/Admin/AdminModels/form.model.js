import mongoose from "mongoose";

/* =========================
   FIELD SCHEMA
   ========================= */
const FieldSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    required: true
  },

  label: {
    type: String,
    required: true
  },

  helperText: String,

  type: {
    type: String,
    enum: [
      "text",
      "number",
      "textarea",
      "radio",
      "checkbox",
      "select",
      "date",
      "yesno",
      "table",
      "file"
    ],
    required: true
  },

  required: {
    type: Boolean,
    default: false
  },

  /* ===== Options for select / radio / checkbox ===== */
  options: [
    {
      label: String,
      value: String
    }
  ],

  /* ===== Validation Rules ===== */
  validation: {
    min: Number,
    max: Number,
    regex: String
  },

  /* ===== UI Behaviour ===== */
  ui: {
    placeholder: String,
    unit: String,   // ₹, per hour, per sq ft, etc
    order: Number
  },

  /* ===== WHO CAN SEE THIS FIELD ===== */
  visibilityScope: {
    type: [String],
    enum: ["admin", "professional", "customer"],
    default: ["professional"]
  },

  /* ===== SUMMARY CONFIG (OPTIONAL, GENERIC) ===== */
  summary: {
    showToCustomer: {
      type: Boolean,
      default: false
    },

    showToProfessional: {
      type: Boolean,
      default: false
    },

    /**
     * Template based summary
     * Examples:
     * "Visiting fee: ₹{{value}}"
     * "{{work}} – ₹{{rate}} / {{unit}}"
     */
    template: String,

    /* For yes/no fields */
    whenTrue: String,
    whenFalse: String,

    /**
     * Grouping for summary
     * NOT pricing-specific
     */
    group: {
      type: String,
      enum: ["primary", "details", "terms", "extras"],
      default: "details"
    }
  },

  /* ===== EDIT RULES ===== */
  editable: {
    afterSubmit: {
      type: Boolean,
      default: false
    }
  }
});

/* =========================
   SECTION SCHEMA
   ========================= */
const SectionSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: String,

  order: Number,

  fields: [FieldSchema]
});

/* =========================
   FORM SCHEMA
   ========================= */
const FormSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true // electrician_pricing_v1, professional_kyc_v1
    },

    purpose: {
      type: String,
      required: true
      // pricing | onboarding | kyc | profile | survey | settings
    },

    title: {
      type: String,
      required: true
    },

    description: String,

    target: {
      entity: {
        type: String
        // service | professional | booking | user | admin
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "target.entity"
      }
    },

    version: {
      type: Number,
      default: 1
    },

    isActive: {
      type: Boolean,
      default: true
    },

    sections: [SectionSchema]
  },
  { timestamps: true }
);

export const Form = mongoose.model("Form", FormSchema);



