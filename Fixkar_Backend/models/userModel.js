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
        select : false
    },
    isMobileVerified : {type : Boolean, 
        default : false
    },
    mobile : {
        type : String,
    },
    isEmailVerified : {type : Boolean,
        default : false
    },
    role : {type : String,
        required : true,
        enum : ['customer', 'professional'],
    },
    termsAcceptance: {
        accepted: {
            type: Boolean,
            default: false,
            select: false
        },
        acceptedAt: {
            type: Date,
            select: false
        },
        acceptedIP: {
            type: String,
            select: false
        },
        policyVersion: {
            type: String,
            select: false
        }
    },
    professionalAcceptance: {
    accepted: {
        type: Boolean,
        default: false,
        select: false
    },
    acceptedAt: {
        type: Date,
        select: false
    },
    acceptedIP: {
        type: String,
        select: false
    },
    policyVersion: {
        type: String,
        select: false
    }
    },
    fcmTokens : {
        type : [String], 
        default : [],
        select : false
    }
},{timestamps:true});   

export const User = mongoose.model("User", userSchema);

const professionalSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    dob : {type : Date},
    profession : {type : mongoose.Schema.Types.ObjectId, ref : "Service"},
    selectedSkills : [{type : mongoose.Schema.Types.ObjectId, ref : "Skill"}],
    description : {type : String},
    address : {addressLine : String,
        lat : Number,
        lng : Number
    },
    location : {
        type : {
            type : String,
            enum : ['Point'],
            default : 'Point'
        },
        coordinates : {
            type : [Number],
            default : [0,0]
        }
    },
    profilePicture : {type : String},
    public_id : {type : String},
    charges : {
        amountType : {
            type : String,
            enum : ["hourly", "daily", "contract", "multiple"],
        },
        hourly : {
            amount : String,
        },
        daily : {
            amount : String,
        },
        contract : {
            minAmount : String,
            maxAmount : String,
        },
        amountDesc : {
            type : String,
        }
    },
    gallery : [{type : mongoose.Schema.Types.ObjectId, ref : 'Gallery'}],
    poi : {type : String},
    status : {
        type : String,
        enum : ['pending', 'approved', 'rejected'],
        default : 'pending'
    },
    onBoarded : {type : Boolean, default : false},
    busyDays : [{type : String}],
    reviews : [{type : mongoose.Schema.Types.ObjectId, ref : "Review",}],
    rejectionCount : {type : Number, default : 0},
    acceptedBy : {type : mongoose.Schema.Types.ObjectId, ref : "Admin"},
    rejectedBy : {type : mongoose.Schema.Types.ObjectId, ref : "Admin"},
    bankVerified : {type : Boolean, default : false},
    bankDetails : {
        bankName : {type : String, select : false},
        holderName : {type : String, select : false},
        accountNumber : {type : String, select : false},
        ifsc : {type : String, select : false},
        upi : {type : String, select : false},
        panNumber : {type : String, select : false},
        docPicUrl : {type : String, select : false}
    },
    bankVerificationStatus : {type : String, default : 'N/A', enum : ['pending', 'approved', 'N/A'],}

},{timestamps : true});

professionalSchema.index({location : "2dsphere"})

export const Professional = mongoose.model("Professional", professionalSchema);


const customerSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    address : {type : String},
    totalBookings : {type : Number, default : 0}
},{timestamps : true});

export const Customer = mongoose.model("Customer", customerSchema);