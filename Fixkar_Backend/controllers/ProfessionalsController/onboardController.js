import cloudinary from "../../config/cloudinary.js";
import { Service } from "../../models/serviceModel.js";
import { Professional, User } from "../../models/userModel.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import slugify from "slugify";

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

        const service = await Service.findById(profession);
      if (!service) {
      return res.status(400).json({
        message: "Invalid profession selected",
      });
    }

        // Step 4: Find the professional by userId
    const professional = await Professional.findOne({ userId: req.userId });

    if (!professional) {
      return res.status(404).json({ message: "Professional not found" });
    }

    const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

    // Step 3: Upload both files
    const [profileResult, poiResult] = await Promise.all([
      uploadToCloudinary(profilePicture, "professionals/profile_pictures", "image"),
      uploadToCloudinary(poi, "professionals/poi_documents", "image"),
    ]);


    const baseSlug = slugify(
  `${user.fullName}-${service.name}-${address}`,
  {
    lower: true,
    strict: true,
    trim: true,
  }
);

let slug = baseSlug;
let count = 1;

while (true) {
  const existingProfessional = await Professional.findOne({ slug });

  if (
    !existingProfessional ||
    existingProfessional.userId.toString() === req.userId.toString()
  ) {
    break;
  }

  slug = `${baseSlug}-${count}`;
  count++;
}
    
    // Step 5: Update professional data
   await Professional.findOneAndUpdate(
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
        profession : service._id,
        profilePicture: profileResult.secure_url,
        public_id : profileResult.public_id,
        poi: poiResult.secure_url,
        onBoarded: true, // optional flag
        slug
      },
      { new: true } // return updated document
    );



      const updatedProfessional = await Professional.findOne({
      userId: req.userId,
    }).select('-poi -dob').populate("userId", '-password').populate({
        path: "reviews",
        options: {
          sort: { createdAt: -1 },
          limit: 10   // latest 5 reviews
        }
      }).populate({
        path: "gallery",
        options: {
          sort: { createdAt: -1 },
          limit: 20   // latest 6 images
        }
      }).populate({
        path : "profession",
        select : "name image skills serviceType",
        populate: {
          path: "skills",
          select: "name bookingType fixedPrice pricingSource isActive", // Skill schema field
        },
      }).populate({
        path : "selectedSkills",
        select : "name"
      });
    
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
