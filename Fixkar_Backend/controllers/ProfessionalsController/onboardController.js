import cloudinary from "../../config/cloudinary.js";
import { Professional, User } from "../../models/userModel.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const onboard = async (req, res) => {
  try {
    const { dob, address, profession, lat,lng } = req.body;

    // Step 1: Validation
    if (!dob || !address || !profession) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const profilePicture = req.files?.profilePicture?.[0];
    const poi = req.files?.poi?.[0];

    if (!profilePicture || !poi) {
      return res
        .status(400)
        .json({ message: "Profile picture and ID proof required" });
    }


    // Step 3: Upload both files
    const [profileResult, poiResult] = await Promise.all([
      uploadToCloudinary(profilePicture),
      uploadToCloudinary(poi),
    ]);

    // Step 4: Find the professional by userId
    const professional = await Professional.findOne({ userId: req.userId });

    if (!professional) {
      return res.status(404).json({ message: "Professional not found" });
    }

    // Step 5: Update professional data
    const updatedProfessional = await Professional.findOneAndUpdate(
      { userId: req.userId },
      {
        dob,
        address : {
          addressLine : address,
          lat,
          lng
        },
        location : {
          type : 'Point',
          coordinates : [lng, lat]
        },
        profession,
        profilePicture: profileResult.secure_url,
        public_id : profileResult.public_id,
        poi: poiResult.secure_url,
        onBoarded: true, // optional flag
      },
      { new: true } // return updated document
    );
    
    // Step 6: Response
    return res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
      user: updatedProfessional,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
