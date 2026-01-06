import { Admin } from "../AdminModels/admin.model.js";

export const getCurrentAdmin = async (req, res)=>{
    try {
       const adminId = req.userId;
       if(!adminId){
        return
       } 
       const admin = await Admin.findById(adminId);
       if(!admin){
        return res.status(404).json({
            message : "Admin not found!"
        })
       }

       return res.status(200).json({
        message : "Success true!",
        admin
       })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}