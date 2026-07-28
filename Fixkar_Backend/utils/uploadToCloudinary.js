import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
     let resourceType = "image";
    let flags;

    // 📄 PDF / DOC
    if (file.mimetype === "application/pdf") {
      resourceType = "raw";
      flags = "attachment:false"; // browser mein open ho
    }

    // 🎥 Video
    else if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
    }

        else if (file.mimetype.startsWith("audio/")) {
      resourceType = "video"; // Cloudinary rule
    }


    // 🖼️ Image → default image
    else if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
    }

     else {
      return reject(new Error("Unsupported file type"));
    }

   const fileName = file.originalname
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
