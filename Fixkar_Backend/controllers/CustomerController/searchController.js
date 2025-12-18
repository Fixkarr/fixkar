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
            coordinates: [lng, lat], // ✅ lng, lat
          },
          distanceField: "distance", // meters
          maxDistance: 100 * 1000, // 100km
          spherical: true,
          query: {
            status: "approved",
            onBoarded: true,
          },
        },
      }
    ];

    // 🔍 service filter (simple & safe)
    if (service && service.trim() !== "") {
      pipeline.push({
        $match: {
          profession: { $regex: service, $options: "i" },
        },
      });
    }

    // 🔗 populate userId
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: "$userId",
      },
      {
        $project: {
          __v: 0,
          updatedAt: 0,
          availability: 0,
          reviews: 0,
          "userId.password": 0,
          "userId.__v": 0,
        },
      },
      {
        $limit: 50,
      }
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
