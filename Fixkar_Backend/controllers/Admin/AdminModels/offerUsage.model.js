import mongoose from "mongoose";

const offerUsageSchema = new mongoose.Schema({
    offerId : {type : mongoose.Schema.Types.ObjectId, ref : "Offer"},
    userId : {type : mongoose.Schema.Types.ObjectId , ref : "User",  required : true},
    bookingId : {type : mongoose.Schema.Types.ObjectId, ref : "Booking",  required : true},
     discountAmount: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ["ONLINE", "CASH"]
  },
  status: {
    type: String,
    enum: ["used", "reversed"],
    default: "used"
  }
},{timestamps : true});

offerUsageSchema.index(
  { offerId: 1, userId: 1, bookingId: 1 },
  { unique: true }
);

export const OfferUsage = mongoose.model("OfferUsage", offerUsageSchema);