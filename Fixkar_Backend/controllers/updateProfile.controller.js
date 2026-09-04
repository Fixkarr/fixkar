import cloudinary from "../config/cloudinary.js";
import { Gallery } from "../models/galleryModel.js";
import { Skill } from "../models/skillsModel.js";
import { Professional, User } from "../models/userModel.js";
import { Service } from "../models/serviceModel.js";
import { io } from "../server.js";
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
        const result = await uploadToCloudinary(file, "professionals/profile_pictures", "image");
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

        const updatedUser = await Professional.findById(updatedPicture._id).select('-poi -dob').populate("userId", '-password').populate({
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
  }).populate({
    path : "profession",
    select : "name image skills serviceType",
    populate : {
      path : "skills",
      select : "name bookingType fixedPrice pricingSource isActive"
    }
  }).populate({
    path : "selectedSkills",
  }).populate('charges');

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

    const professional = await Professional.findOne({userId : req.userId}).select('-poi -dob').populate("userId", '-password').populate({
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
  }).populate({
    path : "profession",
    select : "name image skills serviceType",
    populate : {
      path : "skills",
      select : "name bookingType fixedPrice pricingSource isActive"
    }
  }).populate({
    path : "selectedSkills",
  }).populate('charges');

    return res.status(200).json({
      message: "Professional info updated successfully",
      user: professional,
    });

  } catch (error) {
    console.log("error in updateProfileInfo:", error.message);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};


export const uploadMedia = async (req,res)=>{
  try {
    const user = req.userId; 
    const {mediaUrl, mediaType, publicId} = req.body
    const professional = await Professional.findOne({userId : user})

    if(!professional){
      return res.status(400).json({
        message : "Professional not found!"
      })
    }

    if (professional?.gallery?.length >= 20) {
      return res.status(400).json({
        message: "Gallery limit reached",
      });
    }

     const media = await Gallery.create({
      professionalId : professional._id,
      mediaUrl,
      mediaType,
      publicId
    });

    professional.gallery.push(media._id);
    await professional.save();

    const updatedProfessional = await Professional.findById(
      professional._id
    ).select('-poi -dob').populate('userId', '-password').populate({
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
  }).populate({
    path : "profession",
    select : "name image skills serviceType",
    populate : {
      path : "skills",
      select : "name bookingType fixedPrice pricingSource isActive"
    }
  }).populate({
    path : "selectedSkills",
  }).populate('charges');
  

    return res.status(200).json({
      message : "Media uploaded!",
      user : updatedProfessional
    })

  } catch (error) {
     console.error("Upload Media Error:", error);
    return res.status(500).json({
      success: false,
      message: "Media upload failed",
    });
  }
}

export const updateSkills = async (req, res) => {
  try {
    const { selectedSkills, taskPricing = [], visitingCharge } = req.body;
    const userId = req.userId;

    // 1️⃣ Validation
    if (!Array.isArray(selectedSkills)) {
      return res.status(400).json({
        message: "Selected skills must be an array",
      });
    }

    // 2️⃣ Find professional
    const professional = await Professional.findOne({ userId });

    if (!professional) {
      return res.status(404).json({
        message: "Professional not found!",
      });
    }

    const skillDocs = await Skill.find({
      _id: { $in: selectedSkills },
      service: professional.profession,
      isActive: true,
    });
    if (skillDocs.length !== selectedSkills.length) {
      return res.status(400).json({ message: "Invalid skills selected for this service" });
    }

    const service = await Service.findById(professional.profession).select("serviceType");
    if (!service) return res.status(400).json({ message: "Professional service not found" });

  if (
  service.serviceType === "specialized" &&
  (
    visitingCharge === undefined ||
    !Number.isFinite(Number(visitingCharge)) ||
    Number(visitingCharge) < 0
  )
) {
  return res.status(400).json({
    message: "Visiting charge must be a valid amount",
  });
}

    let validatedTaskPricing = [];
    if (service.serviceType === "specialized") {
     const ratesBySkill = new Map(
  (taskPricing || []).map((rate) => [
    String(rate.skill),
    Number(rate.price),
  ])
);
      for (const skill of skillDocs) {
        const price = ratesBySkill.get(String(skill._id));
        if (!Number.isFinite(price) || price < 0) {
          return res.status(400).json({ message: `Set a valid price for ${skill.name}` });
        }
        validatedTaskPricing.push({ skill: skill._id, price });
      }
    }
        
    
    // 3️⃣ OPTIONAL: allow empty array (skill reset)

    
    professional.selectedSkills = selectedSkills;
   if (service.serviceType === "specialized") {
  professional.visitingCharge = Number(visitingCharge);
}
  if (service.serviceType === "specialized") {
  professional.taskPricing = validatedTaskPricing;
}
    professional.isChargesDefined = true;
    await professional.save();

    // 4️⃣ Re-fetch populated professional (🔥 SAME PATTERN)
    const populatedProfessional = await Professional.findById(
      professional._id
    )
      .select("-poi -dob")
      .populate("userId", "-password")
      .populate({
        path: "reviews",
        options: {
          sort: { createdAt: -1 },
          limit: 10,
        },
      })
      .populate({
        path: "gallery",
        options: {
          sort: { createdAt: -1 },
          limit: 20,
        },
      })
      .populate({
        path: "profession",
        select: "name image skills serviceType",
        populate: {
          path: "skills",
          select: "name bookingType fixedPrice pricingSource isActive",
        },
      })
      .populate({
        path: "selectedSkills",
        select: "name bookingType fixedPrice pricingSource isActive",
      }).populate('charges');

    // 5️⃣ Response
    return res.status(200).json({
      message: "Skills updated successfully!",
      user: populatedProfessional,
    });

  } catch (error) {
    console.error("Update Skills Error:", error);
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};
