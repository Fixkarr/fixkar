import { Professional } from "../../models/userModel.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const bankDetails = async (req, res)=> {
    try {
        const proId = req.userId;
        if(!proId){
            return res.status(400).json({
                messgage : "Unauthorized Access!"
            })
        }
        const {bankName,holderName,accountNumber,ifsc,upi,panNumber} = req.body
        if( !bankName ||
  !holderName ||
  !accountNumber ||
  !ifsc ||
  !panNumber){
            return res.status(400).json({
                message : "All Fields are required!"
            })
        }

         const passbookImage = req.file;
         if(!passbookImage){
           return res.status(400).json({
  message: "Passbook image is required"
});
         }

         const professional = await Professional.findOne({userId : proId});
         if(!professional){
            return res.status(404).json({
                message : "Professional not found!"
            })
         }

         if (professional.bankVerificationStatus === "pending") {
            return res.status(400).json({
                message: "Bank details already submitted and under review"
            });
            }

        const imageResult = await uploadToCloudinary(passbookImage, '/professionals/bankProofs')
        if(!imageResult){
            return res.status(400).json({
                message : "Failed to upload picture!"
            })
        }

         professional.bankDetails = {
            bankName,
            holderName,
            accountNumber,
            ifsc,
            upi,
            panNumber,
            docPicUrl : imageResult.secure_url
         }
         professional.bankVerificationStatus = "pending"
         await professional.save();

           const updatedProfessional = await Professional.findOne({
      userId: req.userId,
    }).select('-poi -dob').populate("userId", '-password').populate({
        path: "reviews",
        options: {
          sort: { createdAt: -1 },
          limit: 10   // latest 5 reviews
        }
      }).populate({
        path: "gallery",
        options: {
          sort: { createdAt: -1 },
          limit: 20   // latest 6 images
        }
      }).populate({
        path : "profession",
        select : "name image skills",
        populate: {
          path: "skills",
          select: "name", // Skill schema field
        },
      }).populate({
        path : "selectedSkills",
        select : "name"
      });
    
    // Step 6: Response
    return res.status(200).json({
      success: true,
      message: "Bank Details Submitted",
      user: updatedProfessional,
    });

    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}