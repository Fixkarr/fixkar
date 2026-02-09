import mongoose from "mongoose";

/* =========================
   FORM RESPONSE
   ========================= */
const FormResponseSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true
    },

    responder: {
      entity: {
        type: String,
        required: true
        // professional | user | admin
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "responder.entity"
      }
    },

    /* ===== RAW ANSWERS ===== */
    answers: [
      {
        fieldId: {
          type: String,
          required: true
        },

        value: mongoose.Schema.Types.Mixed
        // text | number | boolean | array | object
      }
    ],

    /* ===== COMPUTED / DERIVED DATA ===== */
    computed: {
      summary: {
        customer: {
          type: Map,
          of: [String]
          /*
            Example:
            {
              primary: ["Visiting fee: ₹150"],
              details: ["Normal Point – ₹120 / point"],
              terms: ["Material charged separately"]
            }
          */
        },

        professional: {
          type: Map,
          of: [String]
        }
      }
    },

    isSubmitted: {
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
