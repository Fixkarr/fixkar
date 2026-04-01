import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title : {type : String, required : true},
    message : {type : String, required : true},
    link : {type : String},
    audience : {type : String, enum : ['all', 'customer', 'professional'], required : true},
    professions : [{type : String}],
    imageUrl : {type : String},
    public_id : {type : String},
},{timestamps: true});

export const Announcement = mongoose.model("Announcement", announcementSchema);