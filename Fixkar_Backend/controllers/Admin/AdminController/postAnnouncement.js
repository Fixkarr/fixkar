import { Notification } from "../../../models/notificationModel.js";
import { User } from "../../../models/userModel.js";
import { pushNotification } from "../../../services/pushNotification.js";
import { sendBulkEmail } from "../../../utils/mailer.js";
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

    let users = [];

    if (audience === "customer") {
    users = await User.find({ role: "customer" });

    } else if (audience === "professional") {
    users = await User.find({
        role: "professional",
        profession: { $in: professions },
    });

    } else if (audience === "all") {
    users = await User.find({});
    }

    const emails = users.map((u) => u.email);

    await sendBulkEmail(emails, title, `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f5f7fb;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb; padding:20px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background:#0d6efd; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">Fixkar</h1>
              <p style="color:#e0e0e0; margin:5px 0 0;">Your Trusted Service Partner</p>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:30px 25px 10px;">
              <h2 style="margin:0; color:#333; font-size:22px;">
                ${title}
              </h2>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:10px 25px 20px;">
              <p style="margin:0; color:#555; font-size:16px; line-height:1.6;">
                ${message}
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          ${
            link
              ? `
          <tr>
            <td align="center" style="padding:20px;">
              <a href="${link}" 
                 style="background:#0d6efd; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:30px; font-weight:bold; display:inline-block;">
                 View Details
              </a>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Divider -->
          <tr>
            <td style="padding:10px 25px;">
              <hr style="border:none; border-top:1px solid #eee;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 25px; text-align:center;">
              <p style="margin:0; font-size:14px; color:#888;">
                You are receiving this email because you are a registered user of Fixkar.
              </p>
              <p style="margin:5px 0 0; font-size:13px; color:#aaa;">
                © ${new Date().getFullYear()} Fixkar. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`);

          await pushNotification({
            userId: users.map(u => u._id),
            title,
            message,
            redirectUrl: link || "",
          })


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