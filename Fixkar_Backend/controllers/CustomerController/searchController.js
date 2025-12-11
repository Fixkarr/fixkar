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

    let query = {
      status: "approved",
      onBoarded: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] }, // ✅ Order: Lng, Lat
          $maxDistance: 100 * 1000 // ✅ 100km
        }
      }
    };

    if (service && service.trim() !== "") {
      query.profession = { $regex: service, $options: "i" }; // ✅ Case-insensitive
    }

    const professionals = await Professional.find(query)
      .populate("userId", "fullName email mobile") // ✅ populate user details
      .select("-__v -updatedAt -availability -reviews")
      .limit(50); // optional limit

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
