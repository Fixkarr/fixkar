import mongoose from 'mongoose'

const gallerySchema = new mongoose.Schema({
    professionalId : {type : mongoose.Schema.Types.ObjectId, ref : "Professional", required : true},
    mediaUrl : {type : String, required : true},
    mediaType : {type : String , enum : ['image', 'video'], required :true},
    publicId : {type : String, required : true}

},{timestamps : true})

export const Gallery = mongoose.model('Gallery', gallerySchema);