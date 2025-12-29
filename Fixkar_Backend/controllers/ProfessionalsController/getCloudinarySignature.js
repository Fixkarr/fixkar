// controllers/cloudinarySignature.controller.js
import cloudinary from "../../config/cloudinary.js";

export const getCloudinarySignature = async (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "professional_gallery",
      },
      process.env.CLOUDINARY_API_SECRET
    );
  
      return res.status(200).json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: "professional_gallery",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate Cloudinary signature",
    });
  }
};
