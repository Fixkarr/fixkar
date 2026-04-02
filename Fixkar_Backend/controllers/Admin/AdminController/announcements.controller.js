import { Announcement } from "../AdminModels/announcementModel.js";

export const getAllAnnouncements = async (req, res)=>{
    try {
        const admin = req.admin;
        if(!admin){
            return res.status(401).json({
                message : "Unauthorized!"
            })
        }

        const announcements = await Announcement.find().sort({createdAt : -1});
        return res.status(200).json({
            message : "Announcements fetched successfully!",
            announcements
        });
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}

export const deleteAnnouncement = async (req,res)=>{
    try {
        const admin = req.admin;
        if(!admin){
            return res.status(401).json({
                message : "Unauthorized!"
            })
        }
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                message : "Announcement ID is required!"
            })
        }
        await Announcement.findByIdAndDelete(id);
        return res.status(200).json({
            message : "Announcement deleted successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}