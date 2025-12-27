import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (file, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
      const resourceType = file.mimetype.startsWith("video")
      ? "video"
      : "image";
    
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: `${Date.now()}_${file.originalname.split(".")[0]}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};
