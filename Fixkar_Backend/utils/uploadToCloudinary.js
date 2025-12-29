import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",          // ✅ AUTO = image + video
        chunk_size: 6 * 1024 * 1024,    // ✅ REQUIRED for videos (6MB chunks)
        timeout: 120000,                // ✅ 2 min timeout
        secure: true,                   // ✅ HTTPS
        public_id: `${Date.now()}_${file.originalname
          .split(".")
          .slice(0, -1)
          .join(".")}`,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // ✅ Proper buffer stream end
    stream.end(file.buffer);
  });
};
