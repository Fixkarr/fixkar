import { Professional } from "../../models/userModel.js";


export const getAllProfessionals = async (req,res)=>{
    try {
        const professionals = await Professional.find().populate({
          path : "userId",
          model : "User",
          select : "+termsAcceptance +professionalAcceptance"
        }).populate({
    path: "reviews",
    options: {
      sort: { createdAt: -1 },
      limit: 10   // latest 5 reviews
    }
  })
  .populate({
    path: "gallery",
    options: {
      sort: { createdAt: -1 },
      limit: 20   // latest 6 images
    }
  }).populate({
    path : "profession",
    select : "name image skills",
    populate : {
      path : "skills",
      select : "name"
    }
  }).populate({
    path : "selectedSkills",
    select : "name"
  });
  
        res.status(200).json({
            messagge : "success",
            users : professionals
        })
    } catch (error) {
        console.log("error in getAllProfessionals");
        res.status(500).json({message : "internal server error"})
    }
}


export const getAllVerifiedProfessionals = async (req,res)=>{
    try {
        const verifiedProfessionals = await Professional.find({status : "approved"}).select('-poi -dob').populate("userId", '-password').populate({
    path : "profession",
    select : "name image skills",
    populate : {
      path : "skills",
      select : "name"
    }
  });
        if(!verifiedProfessionals){
            return res.status(404).json({message: "Professionals Not Found"})
        }

        res.status(200).json({message : "success", verifiedProfessionals})
    } catch (error) {
            console.log("error in getAllVerifiedProfessionals", error)
            res.status(500).json({
                message : "internal server error"
            })
    }
}