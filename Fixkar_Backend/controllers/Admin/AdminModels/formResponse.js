import mongoose from "mongoose";

/* =========================
   FORM RESPONSE SCHEMA
   ========================= */
const FormResponseSchema = new mongoose.Schema(
  {
    /* ===== FORM INFO ===== */
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true
    },

    formKey: {
      type: String,
      required: true // electrician_pricing
    },

    purpose: {
      type: String,
      required: true // pricing | onboarding | kyc
    },

    /* ===== WHO FILLED ===== */
    filledBy: {type : mongoose.Types.ObjectId, ref : "User", required : true},

    /* ===== RAW RESPONSES ===== */
    responses: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true
    },

    /* ===== GENERATED SUMMARY (SNAPSHOT) ===== */
    summary: [
      {
        label: {
          type: String, // admin-defined summary string
          required: true
        },

        value: {
          type: String, // formatted value
          required: true
        },

        group: {
          type: String, // section title
          required: true
        }
      }
    ],

    /* ===== STATUS ===== */
    isEditable: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const FormResponse = mongoose.model(
  "FormResponse",
  FormResponseSchema
);
