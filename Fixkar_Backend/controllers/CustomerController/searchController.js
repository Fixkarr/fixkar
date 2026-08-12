import mongoose from "mongoose";
import { Professional } from "../../models/userModel.js";

export const searchProfessionals = async (req, res) => {
  try {
    let {
      lat,
      lng,
      service,
      skills = [],
      minRating,
      sortBy,
      page = 1,
      limit = 20,
    } = req.query;

    lat = parseFloat(lat);
    lng = parseFloat(lng);
    const hasLocation =
    Number.isFinite(lat) && Number.isFinite(lng);
    
    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit) || 20, 1), 50);
    const ratingFilter = Number(minRating);

    const skip = (page - 1) * limit;

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

    if (service && mongoose.Types.ObjectId.isValid(service)) {
      pipeline.push({
        $match: {
          "profession._id": new mongoose.Types.ObjectId(service),
        },
      });
    }

    const validSkillIds = skills.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validSkillIds.length > 0) {
      pipeline.push({
        $match: {
          selectedSkills: {
            $in: validSkillIds.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      });
    }

    pipeline.push({
      $lookup: {
        from: "skills",
        localField: "profession.skills",
        foreignField: "_id",
        as: "profession.skills",
      },
    });

    pipeline.push(
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "professionalId",
          as: "reviewStats",
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: "$reviewStats.rating" }, 0] },
          reviewCount: { $size: "$reviewStats" },
        },
      }
    );

    if (Number.isFinite(ratingFilter) && ratingFilter > 0) {
      pipeline.push({ $match: { averageRating: { $gte: Math.min(ratingFilter, 5) } } });
    }

    const ratingSort = { averageRating: -1, reviewCount: -1, _id: 1 };
    if (sortBy === "rating_desc" || !hasLocation) {
      pipeline.push({ $sort: ratingSort });
    } else if (sortBy === "rating_asc") {
      pipeline.push({ $sort: { averageRating: 1, reviewCount: 1, distance: 1, _id: 1 } });
    } else {
      pipeline.push({ $sort: { distance: 1, ...ratingSort } });
    }

    pipeline.push({
      $lookup: {
        from: "skills",
        localField: "selectedSkills",
        foreignField: "_id",
        as: "selectedSkills",
      },
    });

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

    pipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    pipeline.push({
      $project: {
        __v: 0,
        updatedAt: 0,
        availability: 0,
        reviews: 0,
        reviewStats: 0,
        poi: 0,
        dob: 0,

        "userId.password": 0,
        "userId.email": 0,
        "userId.mobile": 0,
        "userId.role": 0,
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
