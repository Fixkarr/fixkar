import mongoose from "mongoose";

const creditTransactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
    },
    type: {
      type: String,
      enum: ["EARNED", "SPENT", "REVERSED", "EXPIRED", "ADJUSTMENT"],
      required: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 0,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    referenceModel: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// A booking can create each reward only once, even if its payment endpoint is retried.
creditTransactionSchema.index(
  { source: 1, referenceId: 1, type: 1 },
  { unique: true, partialFilterExpression: { referenceId: { $type: "objectId" } } }
);

export const CreditTransaction = mongoose.model(
  "CreditTransaction",
  creditTransactionSchema
);
