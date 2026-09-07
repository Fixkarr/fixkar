import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (file, folder, resourceTypeOverride) => {
  return new Promise((resolve, reject) => {
     let resourceType =  resourceTypeOverride || "image";;
    let flags;

     const mimetype = file?.mimetype || "image/jpeg";
    const originalname = file?.originalname || `upload_${Date.now()}.jpg`;

    // 📄 PDF / DOC
   if (!resourceTypeOverride && mimetype === "application/pdf") {
      resourceType = "raw";
      flags = "attachment:false";
    }

    // Video
    else if (!resourceTypeOverride && mimetype.startsWith("video/")) {
      resourceType = "video";
    }

    // Audio
    else if (!resourceTypeOverride && mimetype.startsWith("audio/")) {
      resourceType = "video";
    }

    // Image
    else if (!resourceTypeOverride && mimetype.startsWith("image/")) {
      resourceType = "image";
    }

    else if (!resourceTypeOverride && !mimetype.startsWith("image/")) {
      return reject(new Error("Unsupported file type"));
    }


   const fileName = originalname
  .replace(/\.[^/.]+$/, "")      // extension remove
  .trim()                        // start/end spaces remove
  .replace(/\s+/g, "_")          // spaces -> underscore
  .replace(/[^\w-]/g, "_");

    
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        chunk_size: 6 * 1024 * 1024,    
        timeout: 120000,               
        secure: true,   
        flags,              // ✅ HTTPS
        public_id: `${Date.now()}_${fileName}`,
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
