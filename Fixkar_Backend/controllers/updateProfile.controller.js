import cloudinary from "../config/cloudinary.js";
import { Professional, User } from "../models/userModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js"

export const updateProfilePicture = async (req,res)=>{
    const profilePictureArray = req.files?.profilePicture; 

    const file = profilePictureArray?.[0]; 
    if(!file){
       return res.status(404).json({
            message : "Profile picture required!"
        })
    }

    try {
        const result = await uploadToCloudinary(file);
        if(!result){
          return  res.status(404).json({
                message : "failed to upload your profile Picture, try again!"
            })
        }
        const userId = req.userId;

        const professional = await Professional.findOne({userId});
        if(!professional){
           return res.status(404).json({
                message : "Professional not found!"
            })
        }

        const oldPublicId = professional.public_id
        if(oldPublicId){
            await cloudinary.uploader.destroy(oldPublicId)
        }

        const updatedPicture = await Professional.findOneAndUpdate({userId} , {
            profilePicture : result.secure_url,
            public_id : result.public_id
        }, {new : true})

        const updatedUser = await Professional.findById(updatedPicture._id).populate("userId");

        if(!updatedPicture){
           return res.status(400).json({
                message : "Failed to update picture"
            })
        }

       return res.status(200).json({
            message : "Profile Picture updated!",
            user : updatedUser
        })
      
    } catch (error) {
        res.status(500).json({
            message : "Internal server Error!",
            error : error.message
        })
    }
}

export const updateProfileInfo = async (req, res) => {
  try {
    const { fullName, description, address, lat, lng } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Dynamic update object for User collection
    const userUpdateData = {};
    if (typeof fullName === 'string' && fullName.trim() !== '') {
      userUpdateData.fullName = fullName.trim();
    }

    // Convert lat/lng to numbers if valid
    const latitude = lat !== undefined ? Number(lat) : undefined;
    const longitude = lng !== undefined ? Number(lng) : undefined;

    // Dynamic update object for Professional collection
    const professionalUpdateData = {};

    if (typeof description === 'string' && description.trim() !== '') {
      professionalUpdateData.description = description.trim();
    }

    // Update address only if provided and lat/lng valid numbers
    if (typeof address === 'string' && address.trim() !== '' && !isNaN(latitude) && !isNaN(longitude)) {
      professionalUpdateData.address = {
        addressLine: address.trim(),
        lat: latitude,
        lng: longitude,
      };
      professionalUpdateData.location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    // Run updates in parallel
    const [updatedUser, updatedProfessional] = await Promise.all([
      Object.keys(userUpdateData).length > 0
        ? User.findByIdAndUpdate(req.userId, userUpdateData, { new: true })
        : Promise.resolve(null),  // Skip update if no fields

      Object.keys(professionalUpdateData).length > 0
        ? Professional.findOneAndUpdate(
            { userId: req.userId },
            professionalUpdateData,
            { new: true }
          ).populate("userId")
        : Promise.resolve(null),
    ]);

    if (!updatedProfessional && !updatedUser) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    return res.status(200).json({
      message: "Professional info updated successfully",
      user: updatedProfessional || updatedUser,
    });

  } catch (error) {
    console.log("error in updateProfileInfo:", error.message);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};



export  const updateCharge = async (req,res)=>{

}