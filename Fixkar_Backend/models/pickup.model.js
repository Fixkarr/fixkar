import mongoose from "mongoose";

const pickupRequestSchema = new mongoose.Schema(
  {
    // One search session shared by all professionals
    pickupSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // Created only after a professional accepts
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
      index: true,
    },

    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    distanceInKm: {
      type: Number,
      required: true,
    },

    durationInMinutes: {
      type: Number,
      default: null,
    },

    attemptNo: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "expired",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    cancelledByCustomer: {
      type: Boolean,
      default: false,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    notificationSent: {
      type: Boolean,
      default: false,
    },

    socketDelivered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

pickupRequestSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 300,
  }
);

export const PickupRequest = mongoose.model(
  "PickupRequest",
  pickupRequestSchema
);