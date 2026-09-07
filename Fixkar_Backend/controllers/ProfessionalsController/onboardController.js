import sharp from "sharp";
import { Service } from "../../models/serviceModel.js";
import { Professional, User } from "../../models/userModel.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import slugify from "slugify";
import { ServiceRequest } from "../../models/serviceRequest.js";

export const onboard = async (req, res) => {
  try {
    const { dob, address, profession, serviceName, description,  lat,lng } = req.body;

    // Step 1: Validation
    if (!dob || !address) {
      return res.status(400).json({ message: "DOB and address are required" });
    }
    const hasExistingService = Boolean(profession);
    const hasServiceRequest = Boolean(serviceName && description);

    if (!hasExistingService && !hasServiceRequest) {
      return res.status(400).json({
        message: "Please select a profession or provide your service details",
      });
    }

    if (!hasExistingService && (!serviceName || !description)) {
      return res.status(400).json({
        message: "Service name and description are required",
      });
    }

    const profilePicture = req.files?.profilePicture?.[0];
    const poiFront = req.files?.poiFront?.[0];
    const poiBack = req.files?.poiBack?.[0];

    if (!profilePicture || !poiFront || !poiBack) {
      return res
        .status(400)
        .json({ message: "Profile picture and ID proof required" });
    }

     let service = null;

      if (profession) {
        service = await Service.findById(profession);

        if (!service) {
          return res.status(400).json({
            message: "Invalid profession selected",
          });
        }
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

    if (!service) {
      const existingRequest = await ServiceRequest.findOne({
        professional: professional._id,
        status: "pending_review",
      });

      if (existingRequest) {
        return res.status(400).json({
          message:
            "You already have a service request under review",
        });
      }
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

  let slug = null;

if (service) {
  const baseSlug = slugify(
    `${user.fullName}-${service.name}-${address}`,
    {
      lower: true,
      strict: true,
      trim: true,
    }
  );

  slug = baseSlug;
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
        profession : service ? service._id : null,
        isServiceRequested: !!service,
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
        if (service) {
        return res.status(200).json({
          success: true,
          message: "Onboarding completed successfully",
          user: updatedProfessional,
        });
      }

    // --------------------------------------------------
    // Step 11: Create service request
    // --------------------------------------------------

    await ServiceRequest.create({
      professional: professional._id,
      serviceName: serviceName.trim(),
      description: description.trim(),
      status: "pending_review",
    });

    // --------------------------------------------------
    // Step 12: Response for pending service request
    // --------------------------------------------------
    return res.status(200).json({
      success: true,
      serviceRequestPending: true,
      message:
        "Your onboarding application has been submitted. Your requested service is under review. We will notify you once it is approved.",
      user: updatedProfessional
    });
   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
