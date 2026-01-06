import { Admin } from "../AdminModels/admin.model.js";
import bcrypt from 'bcryptjs'

const ROLE_PERMISSIONS = {
    super_admin: [
        "manage_users",
        "manage_content",
        "manage_bookings",
        "manage_professionals",
        "manage_support",
    ],
    support_admin: [
        "manage_support"
    ],
    content_admin: [
        "manage_content"
    ],
    booking_admin: [
        'manage_bookings',
        'manage_users'
    ],
    professional_admin: [
        'manage_professionals',
        'manage_users'
    ]
}


export const adminSignup = async (req, res) => {
    try {
        const { adminName, username, password, role, secret } = req.body;

        if (!adminName || !username || !password || !role) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({
                message: "username already exist!"
            })
        }

        const usernameRegex = /^[a-zA-Z0-9_.@]+$/;

        const cleanUsername = username.trim();

        if (!usernameRegex.test(cleanUsername)) {
            return res.status(400).json({
                success: false,
                message:
                    "Username allowed characters: letters, numbers, _ . @ (no spaces)",
            });
        }

        if (cleanUsername.length < 4 || cleanUsername.length > 20) {
            return res.status(400).json({
                success: false,
                message: "Username must be between 4 and 20 characters",
            });
        }


        if (secret != process.env.ADMIN_SIGNUP_SECRET) {
            return res.status(401).json({
                message: "Unauthorized access!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 3️⃣ Valid role check
        if (!ROLE_PERMISSIONS[role]) {
            return res.status(400).json({
                success: false,
                message: "Invalid admin role"
            });
        }
        const newAdmin = await Admin.create({
            adminName,
            username,
            password: hashedPassword,
            role,
            permissions: ROLE_PERMISSIONS[role]
        })

        return res.status(200).json({
            message: "New Admin registered!",
            // admin: {
            //     _id: newAdmin._id,
            //     adminName: newAdmin.adminName,
            //     username: newAdmin.username,
            //     role: newAdmin.role,
            //     permissions: newAdmin.permissions
            // }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}