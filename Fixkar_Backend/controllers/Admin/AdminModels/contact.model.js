import mongoose from  "mongoose"
const contactSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true},
    phone : {type : String, required : true},
    message : {type : String, required : true},
    replied : {type : Boolean, default : false},
    senderRole : {type :String, default : "visitor", enum : ["customer", "professional", "visitor"]}
}, {timestamps : true})

export const Contact = mongoose.model("Contact", contactSchema);