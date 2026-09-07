import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
    professional : {type : mongoose.Schema.Types.ObjectId, ref : 'Professional', required : true},
    serviceName : {type : String, required : true},
    description : {type : String, required : true},
    status : {type : String, enum : ['pending_review',  'accepted', 'rejected'], default : 'pending'},
    adminNote : {type : String, default : ''},

}, {timestamps : true})

export const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);