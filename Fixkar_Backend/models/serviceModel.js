import mongoose from 'mongoose'

const serviceShema = new mongoose.Schema({
    name : {type : String, required : true},
    description : {type : String, required : true},
    image : {type : String, required : true},
    professionalCount : {type : Number, default : 0},
    createdBy : {type : mongoose.Schema.Types.ObjectId, ref : "Admin", required : true},
    commission : {type : Number, default : 0, required : true},
    skills : [{type : mongoose.Schema.Types.ObjectId, ref : "Skill"}],
},{timestamps : true})

export const Service = mongoose.model('Service', serviceShema);