import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";
import { Announcement } from "../AdminModels/announcementModel.js";

export const postAnnouncement = async (req, res) => {
  try {
    // ✅ Auth check
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Body data
    const { title, message, link, audience, professions } = req.body;

    // ✅ Validation
    if (!title || !message || !audience) {
      return res.status(400).json({
        message: "Title, Message and Audience are required",
      });
    }

    let imageUrl = null;
    let public_id = null;

    // ✅ Image upload (if exists)
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file,
        "announcements",
        "image"
      );

      if (result) {
        imageUrl = result.secure_url;
        public_id = result.public_id;
      }
    }

    // ✅ Create announcement
    const newAnnouncement = new Announcement({
      title,
      message,
      audience,
      professions: audience === "professional" ? professions : [],
      link: link || null,
      imageUrl,
      public_id,
    });

    // ✅ Save to DB
    await newAnnouncement.save();

    // ✅ Response
    return res.status(201).json({
      message: "Announcement created successfully",
      data: newAnnouncement,
    });

  } catch (error) {
    console.error("Announcement Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};