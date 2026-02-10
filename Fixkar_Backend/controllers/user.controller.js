import { Customer, Professional, User } from "../models/userModel.js";

export const getCurrentUser = async (req, res)=>{
    try {
        const userId = req.userId;
        if(!userId){
            return res.status(400).json({
                message : "UserId not found"
            })
        }

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }
        
        if(user.role === "customer"){
            const customer = await Customer.findOne({userId : user._id}).populate("userId")
            return res.status(200).json({
                message  : "current user fetched successfully",
                user : customer
            })
        }else if(user.role === "professional"){
        const professional = await Professional.findOne({userId : user._id}).select('-poi -dob').populate("userId", '-password').populate({
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
  }).populate('charges');


            return res.status(200).json(
               { message : "current user fetched successfully",
                user : professional}
            )
        }

    } catch (error) {
        console.log("getCurrentUser error", error)
        return res.status(500).json({
            message : "internal server error"
        })
    }
}