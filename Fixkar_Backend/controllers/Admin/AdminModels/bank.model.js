import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    code: {
      type: String, // SBIN, HDFC
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String, // State Bank of India
      required: true,
      unique: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
).index({ name: 1 });;

export const Bank = mongoose.model("Bank", bankSchema);
