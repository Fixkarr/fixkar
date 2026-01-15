import mongoose from 'mongoose'
const skillSchema = new mongoose.Schema({
    name : {type : String, required : true, unique : true},
    service : {type : mongoose.Schema.Types.ObjectId, ref : "Service", required : true},
},{timestamps : true})

export const Skill = mongoose.model('Skill', skillSchema);