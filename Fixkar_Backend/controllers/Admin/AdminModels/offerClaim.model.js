import mongoose from "mongoose";
const offerClaimSchema=new mongoose.Schema({
 offerId:{type:mongoose.Schema.Types.ObjectId,ref:"Offer",required:true,index:true},
 userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
 couponCode:{type:String,required:true,uppercase:true,trim:true},
 status:{type:String,enum:["claimed","redeemed","revoked","expired"],default:"claimed",index:true},
 bookingId:{type:mongoose.Schema.Types.ObjectId,ref:"Booking",default:null},
 discountAmount:{type:Number,default:0},
 redeemedCount:{type:Number,default:0,min:0},
 claimedAt:{type:Date,default:Date.now},
 redeemedAt:{type:Date,default:null},
},{timestamps:true});
offerClaimSchema.index({offerId:1,userId:1},{unique:true});offerClaimSchema.index({couponCode:1,status:1});
offerClaimSchema.pre("save",function(next){if(this.couponCode)this.couponCode=this.couponCode.trim().toUpperCase();next();});
export const OfferClaim=mongoose.model("OfferClaim",offerClaimSchema);
