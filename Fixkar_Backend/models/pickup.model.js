import mongoose from "mongoose";

const pickupRequestSchema = new mongoose.Schema(
  {
    // Main Booking
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    // Professional jise request bheji gayi
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
      index: true,
    },

    // Customer (Quick lookup)
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // Distance from customer
    distanceInKm: {
      type: Number,
      required: true,
    },

    // Google ETA
    durationInMinutes: {
      type: Number,
      default: null,
    },

    // Which attempt?
    // First batch = 1
    // Second batch = 2
    attemptNo: {
      type: Number,
      default: 1,
    },

    // Current request status
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

    // Customer cancelled?
    cancelledByCustomer: {
      type: Boolean,
      default: false,
    },

    // When professional accepted
    acceptedAt: Date,

    // When rejected
    rejectedAt: Date,

    // Expiry time (30 sec)
    expiresAt: {
      type: Date,
      required: true,
    },

    // Push notification sent?
    notificationSent: {
      type: Boolean,
      default: false,
    },

    // Socket delivered?
    socketDelivered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Auto delete after expiry (optional)
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