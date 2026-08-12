import cloudinary from "../../config/cloudinary.js";
import { Professional } from "../../models/userModel.js";

export const getCloudinarySignature = async (req, res) => {
  try {
    const professional = await Professional.findOne({ userId: req.userId }).select("_id status onBoarded");

    if (!professional) {
      return res.status(403).json({
        message: "Professional access required",
      });
    }

    if (professional.status !== "approved" || !professional.onBoarded) {
      return res.status(403).json({
        message: "Your professional account is not eligible for media uploads",
      });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "professional_gallery";

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return res.status(200).json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);
    return res.status(500).json({
      message: "Failed to generate Cloudinary signature",
    });
  }
};
