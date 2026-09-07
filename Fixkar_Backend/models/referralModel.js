import mongoose from 'mongoose'

const referralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  referrerRole: {
    type: String,
    enum: ["customer", "professional"],
    required: true
  },

  referredRole: {
    type: String,
    enum: ["customer", "professional"],
    required: true
  },

  referralCode: {
    type: String,
    required: true
  },

  rewardAmount: {
    type: Number,
    required: true
  },

  rewardType: {
    type: String,
    enum: ["REWARD_CREDIT", "WALLET_CASH"],
    required: true
  },

  status: {
    type: String,
    enum: [
      "REGISTERED",
      "ELIGIBLE",
      "REWARDED",
      "REVERSED"
    ],
    default: "REGISTERED"
  },

  qualifyingBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null
  },

  rewardedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export const Referral = mongoose.model("Referral", referralSchema);