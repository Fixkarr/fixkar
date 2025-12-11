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

    // Convert lat/lng to number
    const latitude = Number(lat);
    const longitude = Number(lng);

    // Parallel Updates (Fastest)
    const [updatedUser, updatedProfessional] = await Promise.all([
      User.findByIdAndUpdate(
        req.userId,
        { fullName },
        { new: true }
      ),

      Professional.findOneAndUpdate(
        { userId: req.userId },
        {
          address: {
            addressLine: address,
            lat: latitude,
            lng: longitude,
          },
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          description,
        },
        { new: true }
      ).populate("userId") // Same query me populate — no second query needed
    ]);

    if (!updatedProfessional) {
      return res.status(404).json({ message: "Professional not found" });
    }

    return res.status(200).json({
      message: "Professional info updated successfully",
      user: updatedProfessional
    });

  } catch (error) {
    console.log("error in updateProfileInfo:", error.message);
    return res.status(500).json({
      message: "Internal server error!"
    });
  }
};


export  const updateCharge = async (req,res)=>{

}