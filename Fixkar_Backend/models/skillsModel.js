import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },
    bookingType: { type: String, enum: ["fixed", "inspection"], required: true, default: "fixed" },
    // Skill-based fixed prices belong to the admin. Specialised task prices
    // belong to the individual professional.
    pricingSource: { type: String, enum: ["admin", "professional"], required: true, default: "admin" },
    fixedPrice: { type: Number, default: null, min: 0 },
    isActive: { type: Boolean, default: true },
    estimatedDuration: { type: Number, default: null },
  },
  { timestamps: true }
);

skillSchema.index({ service: 1, name: 1 }, { unique: true });

export const Skill = mongoose.model("Skill", skillSchema);
