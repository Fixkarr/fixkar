import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    adminName : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    role : {
        type : String,
        enum : ['super_admin', 'support_admin', 'content_admin', 'booking_admin', 'professional_admin'],
         required : true
    },
    password : {type : String, required : true, select : false},
    permissions : [{type : String}],

}, {timestamps : true})

export const Admin = mongoose.model('Admin', adminSchema);