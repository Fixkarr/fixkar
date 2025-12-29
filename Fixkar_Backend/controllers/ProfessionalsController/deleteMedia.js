import {Professional}  from '../../models/userModel.js'
import {Gallery} from '../../models/galleryModel.js'
import cloudinary from '../../config/cloudinary.js'

export const deleteMedia = async(req,res)=>{
    try {
        const myId = req.userId;
        const {mediaId} = req.body;

        const professional = await Professional.findOne({userId : myId});
        if(!professional){
            return res.status(400).json({
                message : "Professional not found!!"            
            })
        }

        const media = await Gallery.findById(mediaId);
        if(!media){
            return res.status(400).json({
                message : "Media not found!!"            
            })
        }

         if (media.professionalId.toString() !== professional._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action"
      });
    }

        // Delete media file from storage (if applicable)
        if(media.publicId){
            await cloudinary.uploader.destroy(media.publicId, {resource_type : media.mediaType === 'video' ? 'video' : 'image'})
        }

        await Gallery.findByIdAndDelete(mediaId);

      const updatedProfessional =  await Professional.findByIdAndUpdate(professional._id, {
            $pull : {gallery : mediaId}
        }).select('-poi -dob').populate('userId', '-password').populate({
            path: "reviews",
            options: {
              sort: { createdAt: -1 },
              limit: 10   // latest 5 reviews
            }
          })
          .populate({
            path: "gallery",
            options: {
              sort: { createdAt: -1 },
              limit: 20   // latest 6 images
            }
          });

         return res.status(200).json({
      message: "Media deleted successfully",
      user : updatedProfessional
    });


    } catch (error) {
          console.error("Delete Gallery Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
    }
}