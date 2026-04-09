  import mongoose from "mongoose";

  const offerSchema = new mongoose.Schema({
    serviceId: [{type : mongoose.Schema.Types.ObjectId, ref : "Service"}],
    offerTitle : {type : String},

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required : true
    },

    discountValue: {type : Number, required : true},
    minBookingAmount: {type : Number},
    maxDiscount : {type : Number},
    startDate: {type : Date},
    endDate: {type : Date},
    usageLimit : {type : Number},
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },

    newCustomerOnly : {type : Boolean, default  : false},
    isActive: { type: Boolean, default: true },
  }).index({ serviceId: 1, isActive: 1 });

  export const Offer = mongoose.model('Offer', offerSchema);