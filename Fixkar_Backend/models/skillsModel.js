const skillSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    service : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Service",
        required : true
    },

   bookingType: {
    type: String,
    enum: ["fixed", "inspection"],
    required: true,
    default: "fixed"
},

pricingSource: {
    type: String,
    enum: ["admin", "professional"],
    default: "admin",
    required: true
},

fixedPrice: {
    type: Number,
    default: null
},
isActive: {
    type: Boolean,
    default: true
},

estimatedDuration: {
    type: Number,
    default: null
}
},{timestamps:true})
