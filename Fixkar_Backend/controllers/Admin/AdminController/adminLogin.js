import {Admin} from '../AdminModels/admin.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { genToken } from '../../../utils/AuthToken.js';

export const adminLogin = async (req, res) =>{
    try {
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({
                message : "All fields are required!",
            })
        }

        const isExists = await Admin
  .findOne({ username })
  .select("+password");

        if(!isExists){
            return res.status(404).json({
                message : "Admin not found!"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, isExists.password);

        if(!isPasswordValid){
            return res.status(401).json({
                message : "Invalid credentials!"
            })
        }

        const token = await genToken(isExists._id);
        const isProduction = process.env.NODE_ENV === "production";

        // Keep admin authentication completely separate from customer/
        // professional authentication. Both systems use JWTs, but they must
        // never share the same cookie name.
        res.cookie("adminToken", token, {
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: "/",
        });

        // An admin login must not leave a user JWT active in the same browser.
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        });

        isExists.password = undefined;

        return res.status(200).json({
            message : "Admin logged in successfully!",
            admin : isExists
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}