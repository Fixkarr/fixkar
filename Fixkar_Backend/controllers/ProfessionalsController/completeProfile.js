import { Professional } from "../../models/userModel.js";


export const completeProfile =async (req,res)=>{
    try {
        const {description,pricingType,hourly,daily,contract,amountDesc} = req.body;
       if(!description || !pricingType){
       return res.status(400).json({
            message  : "Description and Amount type is required"
        })
       }

       const professional = await Professional.findOne({userId : req.userId})

       if(!professional){
        return res.status(404).json({
            message : "Professional not found!"
        })
       }

       const updatedProfessional = await Professional.findByIdAndUpdate(professional._id, {
        description,
        charges : {
            amountType : pricingType,
            hourly,
            daily,
            contract :{
                minAmount : contract?.minPrice,
                maxAmount : contract?.maxPrice
            },
            amountDesc
        }
       },{new : true})

       if(updatedProfessional){
        return res.status(200).json({
            message : "Profile completed successfully!",
            user : updatedProfessional
        })
       }

    } catch (error) {
        console.log("error in complete Profile", error)
        return res.status(500).json({
            message  : "Internal server error!"
        })
    }
}