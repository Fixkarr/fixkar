import mongoose from "mongoose";

const pickupSessionSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    // searching | selecting | confirmed | expired | cancelled
    status: {
      type: String,
      enum: [
        "searching",
        "selecting",
        "confirmed",
        "expired",
        "cancelled",
      ],
      default: "searching",
      index: true,
    },

    // Phase 1
    professionalExpiresAt: {
      type: Date,
      required: true,
    },

    // Phase 2
    customerSelectionExpiresAt: {
      type: Date,
      default: null,
    },

    selectedProfessionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      default: null,
    },

    selectedPickupRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PickupRequest",
      default: null,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const PickupSession = mongoose.model(
  "PickupSession",
  pickupSessionSchema
);