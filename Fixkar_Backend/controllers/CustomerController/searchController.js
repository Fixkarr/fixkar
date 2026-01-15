import { Professional } from "../../models/userModel.js";

export const searchProfessionals = async (req, res) => {
  try {
    let { lat, lng, service } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    lat = parseFloat(lat);
    lng = parseFloat(lng);

    let pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          maxDistance: 100 * 1000,
          spherical: true,
          query: {
            status: "approved",
            onBoarded: true,
          },
        },
      },
    ];

    // 🔍 Service filter (by profession name)
    if (service && service.trim() !== "") {
      pipeline.push({
        $lookup: {
          from: "services",
          localField: "profession",
          foreignField: "_id",
          as: "profession",
        },
      });

      pipeline.push({ $unwind: "$profession" });

      pipeline.push({
        $match: {
          "profession.name": { $regex: service, $options: "i" },
        },
      });
    } else {
      // still populate profession
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
    }

    // 🔗 Populate profession.skills
    pipeline.push(
      {
        $lookup: {
          from: "skills",
          localField: "profession.skills",
          foreignField: "_id",
          as: "profession.skills",
        },
      }
    );

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

    // 🔐 FINAL PROJECTION (SECURITY 🔥)
    pipeline.push(
      {
        $project: {
          __v: 0,
          updatedAt: 0,
          availability: 0,
          reviews: 0,
          poi: 0,
          dob: 0,

          // user security
          "userId.password": 0,
          "userId.__v": 0,
          "userId.fcmTokens": 0,
          "userId.termsAcceptance": 0,
          "userId.professionalAcceptance": 0,
          "userId.isEmailVerified": 0,
          "userId.isMobileVerified": 0,
        },
      },
      { $limit: 50 }
    );

    const professionals = await Professional.aggregate(pipeline);

    return res.status(200).json({
      success: true,
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
