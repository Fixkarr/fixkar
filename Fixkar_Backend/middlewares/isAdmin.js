import jwt from 'jsonwebtoken'
import { Admin } from '../controllers/Admin/AdminModels/admin.model.js';

export const isAdmin = async (req,res,next)=>{
    try {
        const token = req.cookies.adminToken;
        if(!token){
            return res.status(401).json({
                message : "Admin not authorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                message : "Token not verified"
            })
        }

        const admin  = await Admin.findById(decoded.userId);

        if(!admin){
              return res.status(401).json({
                success: false,
                message: "Admin not found",
      });
        }

        req.admin = admin;
        next();

    } catch (error) {
         return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token",
    });
    }
}