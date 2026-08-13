import {Admin} from '../AdminModels/admin.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
    try {
        const {username, password} = req.body;
        if(!username || !password) return res.status(400).json({ message : "All fields are required!" });

        const isExists = await Admin.findOne({ username }).select("+password");
        if(!isExists) return res.status(404).json({ message : "Admin not found!" });

        const isPasswordValid = await bcrypt.compare(password, isExists.password);
        if(!isPasswordValid) return res.status(401).json({ message : "Invalid credentials!" });

        const adminSecret = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET;
        const token = jwt.sign({ userId: isExists._id }, adminSecret, { expiresIn: "1d" });
        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        };

        res.cookie("adminToken", token, cookieOptions);
        res.clearCookie("token", cookieOptions);

        isExists.password = undefined;
        return res.status(200).json({ message : "Admin logged in successfully!", admin : isExists });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal Server Error" });
    }
};
