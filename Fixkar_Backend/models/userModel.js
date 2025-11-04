import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
    },
    isMobileVerified : {type : Boolean, 
        default : false
    },
    mobile : {
        type : String,
    },
    role : {type : String,
        required : true,
        enum : ['customer', 'professional', 'admin'],
    },
},{timestamps:true});   

export const User = mongoose.model("User", userSchema);

const professionalSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    dob : {type : Date},
    profession : {type : String},
    description : {type : String},
    address : {type : String},
    profilePicture : {type : String},
    charges : {type : String},
    gallery : [{type : String}],
    poi : {type : String},
    status : {
        type : String,
        enum : ['pending', 'approved', 'rejected'],
        default : 'pending'
    },
    onBoarded : {type : Boolean, default : false},
    ratings : {type : String, default : 0},
    totalReviews : {type : Number, default : 0},
    availability : {
        availableDays : [{type : Date}],
        busyDays : [{type : Date}]
    },
    reviews : [{type : mongoose.Schema.Types.ObjectId, ref : "Review",}]
},{timestamps : true});

export const Professional = mongoose.model("Professional", professionalSchema);


const customerSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    address : {type : String},
    totalBookings : {type : Number, default : 0}
},{timestamps : true});

export const Customer = mongoose.model("Customer", customerSchema);