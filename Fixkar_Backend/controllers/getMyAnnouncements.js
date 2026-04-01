import { Professional, User } from "../models/userModel.js";
import { Announcement } from "./Admin/AdminModels/announcementModel.js";


export const getMyAnnouncements = async (req, res) => {
  try {
    const userId = req.userId; // middleware se aayega
      const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let query = {};

    
    if (user.role === "customer") {
      query = {
        $or: [
          { audience: "customer" },
          { audience: "all" },
        ],
      };
    }

    // ✅ PROFESSIONAL
    else if (user.role === "professional") {
        const professional = await Professional.findOne({ userId: user._id }).populate('profession', "name");
         const professionName =
        professional?.profession?.name || null;

      query = {
        $or: [
          { audience: "all" },
          {
            audience: "professional",
            $or: [
              professionName
                ? { professions: { $in: [professionName] } }
                : {},
              { professions: { $size: 0 } },
            ],
          },
        ],
      };
    }

    // ✅ FETCH
    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });

  } catch (error) {
    console.error("GetMyAnnouncements Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};