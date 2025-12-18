import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({

   sender : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
   reciever : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    message : {type : String,},
    attachments : [{url : String, fileType : String}],  // array of file URLs or paths
    status : {
        type : String,
        enum : ["pending", "sent", "delivered", "seen"],
        default : "pending"
    },
    deliveredAt : {type : Date, },
    seenAt : {type : Date}
},{timestamps:true});

export const Message = mongoose.model('Message', messageSchema);