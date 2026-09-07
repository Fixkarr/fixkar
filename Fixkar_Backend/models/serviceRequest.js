import mongoose from 'mongoose'

const serviceRequestSchema = new mongoose.Schema({
    professiona : {type : mongoose.Schema.Types.ObjectId, ref : "Professional", required : true},
    serviceName : {type : String, required : true},
    description : {type : String, required : true},
    status : {type : String, enum : ["pending_review", "approved", "rejected"], default : "pending_review"},
    adminNote : {type : String},
},{timestamps : true})

export const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);