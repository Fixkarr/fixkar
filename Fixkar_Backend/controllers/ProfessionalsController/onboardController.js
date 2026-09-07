import sharp from "sharp";
import cloudinary from "../../config/cloudinary.js";
import { Service } from "../../models/serviceModel.js";
import { Professional, User } from "../../models/userModel.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import slugify from "slugify";

export const onboard = async (req, res) => {
  try {
    const { dob, address, profession,  lat,lng } = req.body;

    // Step 1: Validation
    if (!dob || !address || !profession) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const profilePicture = req.files?.profilePicture?.[0];
    const poiFront = req.files?.poiFront?.[0];
    const poiBack = req.files?.poiBack?.[0];

    if (!profilePicture || !poiFront || !poiBack) {
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

      const frontImage = await sharp(poiFront.buffer)
  .rotate()
  .resize({
    width: 1200,
    height: 1600,
    fit: "inside",
    withoutEnlargement: true,
  })
  .png()
  .toBuffer();

  const backImage = await sharp(poiBack.buffer)
  .rotate()
  .resize({
    width: 1200,
    height: 1600,
    fit: "inside",
    withoutEnlargement: true,
  })
  .png()
  .toBuffer();

  const frontMeta = await sharp(frontImage).metadata();
const backMeta = await sharp(backImage).metadata();

const mergedHeight =
  frontMeta.height +
  30 +
  backMeta.height;

const canvas = sharp({
  create: {
    width: Math.max(frontMeta.width, backMeta.width),
    height: mergedHeight,
    channels: 4,
    background: {
      r: 255,
      g: 255,
      b: 255,
      alpha: 1,
    },
  },
});

const mergedPoi = await canvas
  .composite([
    {
      input: frontImage,
      top: 0,
      left: 0,
    },
    {
      input: backImage,
      top: frontMeta.height + 30,
      left: 0,
    },
  ])
  .jpeg({
    quality: 90,
  })
  .toBuffer();

    // Step 3: Upload both files
    const [profileResult, poiResult] = await Promise.all([
      uploadToCloudinary(profilePicture, "professionals/profile_pictures", "image"),
      uploadToCloudinary(
  {
    buffer: mergedPoi,
    mimetype: "image/jpeg",
    originalname: `${user._id}_poi.jpg`,
  },
  "professionals/poi_documents",
  "image"
),
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
