import { sendEmail } from "../utils/mailer.js";
import { Contact } from "./Admin/AdminModels/contact.model.js";

export const sendEnquiry = async (req,res)=>{
    try {
        const {name, email, phone, message} = req.body;
        if(!name || !email || !phone || !message){
            return res.status(400).json({
                message : "All fields are required!"
            })
        }

        const isEnquiryExists = await Contact.find({email,phone, replied : false});
        if(isEnquiryExists.length > 0){
            return res.status(400).json({
                message : "You have already sent an enquiry. We will get back to you soon!"
            })
        }

        const newEnquiry = new Contact({
            name, email, phone, message
        })

        await newEnquiry.save();
        return res.status(200).json({
            message : "Thanks for your enquiry. We will get back to you soon!"
        });
    } catch (error) {
        return res.status(500).json({
            message : "Internal server error"
        });
    }
}

export const getEnquiries = async (req,res)=>{
    try {
        const admin = req.admin;
        if(!admin){
            return res.status(400).json({
                message : "Unauthorized!"
            })
        }

        const enquiries = await Contact.find();
        if(enquiries.length <= 0){
            return res.status(400).json({
                message : "No Enquiries left!"
            })
        }

        return res.status(200).json({
            message : "Enquiries fetched!",
            enquiries,
            enquiriesCount : enquiries.length
        })

    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}

export const replyEnquiry = async (req,res)=>{
    try {
        const {enquiryId} = req.params;

        if(!enquiryId){
            return res.status(400).json({
                message : "Enquiry id not found!"
            })
        }

        const {replyMessage} = req.body;
        if(!replyMessage){
            return res.status(400).json({
                message : "Message is required!"
            })
        }

        const admin = req.admin;

        if(!admin){
            return res.status(400).json({
                message : "Unauthorized!"
            })
        }
        let enquiry = await Contact.findById(enquiryId);

        if(!enquiry){
            return res.status(400).json({
                message : "This enquiry is not exists!"
            })
        }

        if(enquiry.replied){
            return res.status(400).json({
                message : "You have already replied to this enquiry!"
            })
        }

        await sendEmail(enquiry.email, "Regarding Your Enquiry On Fixkar", replyMessage);

        enquiry.replied = true
        await enquiry.save();

        return res.status(200).json({
            message : "Replied!"
        })

    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}