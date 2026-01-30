import mongoose from "mongoose";
import { Professional } from "../../models/userModel.js";

export const searchProfessionals = async (req, res) => {
  try {
    let {
      lat,
      lng,
      service,
      skills = [],     // 🔥 NEW (optional)
      page = 1,
      limit = 20,
    } = req.query;

    // if (!lat || !lng) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Latitude and Longitude are required",
    //   });
    // }

    const hasLocation = lat && lng;

    lat = parseFloat(lat);
    lng = parseFloat(lng);
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // 🔁 skills string → array
    if (typeof skills === "string") {
      skills = skills.split(",");
    }

    let pipeline = [];

    if(hasLocation){
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          maxDistance: 20 * 1000, // 20 km
          spherical: true,
          query: {
            status: "approved",
            onBoarded: true,
          },
        },
      },)
    }else{
        pipeline.push({
        $match: {
          status: "approved",
          onBoarded: true,
        },
  });
    }

    // 🔍 Populate profession
    pipeline.push(
      {
        $lookup: {
          from: "services",
          localField: "profession",
          foreignField: "_id",
          as: "profession",
        },
      },
      { $unwind: "$profession" }
    );

    // 🔍 Service filter (by name)
    if (service && mongoose.Types.ObjectId.isValid(service)) {
  pipeline.push({
    $match: {
      "profession._id": new mongoose.Types.ObjectId(service),
    },
  });
}

    // 🔥 OPTIONAL SKILLS FILTER (MAIN CHANGE)
    if (skills.length > 0) {
      pipeline.push({
        $match: {
          selectedSkills: {
            $in: skills.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      });
    }

    // 🔗 Populate profession.skills
    pipeline.push({
      $lookup: {
        from: "skills",
        localField: "profession.skills",
        foreignField: "_id",
        as: "profession.skills",
      },
    });

    // 🔗 Populate selectedSkills
    pipeline.push({
      $lookup: {
        from: "skills",
        localField: "selectedSkills",
        foreignField: "_id",
        as: "selectedSkills",
      },
    });

    // 🔗 Populate user
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" }
    );

    // ✅ PAGINATION (SAFE)
    pipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    // 🔐 SECURITY PROJECTION
    pipeline.push({
      $project: {
        __v: 0,
        updatedAt: 0,
        availability: 0,
        reviews: 0,
        poi: 0,
        dob: 0,

        "userId.password": 0,
        "userId.__v": 0,
        "userId.fcmTokens": 0,
        "userId.termsAcceptance": 0,
        "userId.professionalAcceptance": 0,
        "userId.isEmailVerified": 0,
        "userId.isMobileVerified": 0,
      },
    });

    const professionals = await Professional.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      page,
      limit,
      count: professionals.length,
      professionals,
    });
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again",
    });
  }
};
