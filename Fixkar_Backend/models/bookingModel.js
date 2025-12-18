import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    customerId : {type : mongoose.Schema.Types.ObjectId, ref : "Customer", required : true},
    customerName : {type : String, required : true},
    professionalId : {type : mongoose.Schema.Types.ObjectId, ref : "Professional", required : true},
    serviceId : {type : mongoose.Schema.Types.ObjectId, ref : "Service", required : true},
    workDate : {type : String, required : true},
    workTime : {type : String, required : true},
    problemDescription : {type : String, required : true},
    status : {
        type : String,
        enum : ['pending', 'accepted', 'in-progress', "rejected", 'completed', 'cancelled'],
    },

})