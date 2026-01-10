import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
    title : {type : String},
    message : {type : String},
    type : {type : String, enum : ['announcement', 'booking', 'message']},
    relatedId : {type : mongoose.Schema.Types.ObjectId},
    isRead : {type : Boolean, default : false},
},{timestamps : true})

export const Notification = mongoose.model('Notification', notificationSchema);