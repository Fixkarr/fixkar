import mongoose from "mongoose";

const pickupRequestSchema = new mongoose.Schema(
  {
    // One search session shared by all professionals
    pickupSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    customerName : {type : String, required :true},
    serviceName : {type : String, required :true},
    taskName : {type : String, required :true},
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
    customerLocation: {
      customerLat: {type: Number, required: true},
      customerLng: {type: Number, required: true},
    },
    customerMobileNumber : {type : Number, required: true},
    workDate : {type : Date, required: true},
    workTime : {type : String, required: true},
    distanceInKm: {
      type: Number,
      required: true,
    },
    workAddress: {
      type: String,
      required: true,
    },
    problemDescription : {
      type : String
    },
    durationInMinutes: {
      type: Number,
      default: null,
    },
    charge : {
      taskPrice: {type: Number, required: true},
      visitingCharge: {type: Number, required: true},
      totalAmount: {type: Number, required: true},
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