import { Skill } from "../../models/skillsModel.js";
import { Professional } from "../../models/userModel.js";


export const completeProfile =async (req,res)=>{
    try {
        const {description,pricingType,hourly,daily,contract,amountDesc, skills} = req.body;
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

       console.log(skills);
    let validatedSkills = [];

    if (skills && Array.isArray(skills) && skills.length > 0) {
      // ensure selected skills belong to same profession
      const skillDocs = await Skill.find({
        _id: { $in: skills },
        service: professional.profession,
      });

      if (skillDocs.length !== skills.length) {
        return res.status(400).json({
          message: "Invalid skills selected for this profession",
        });
      }

      validatedSkills = skillDocs.map((s) => s._id);
    }




        await Professional.findByIdAndUpdate(professional._id, {
        description,
        selectedSkills: validatedSkills,
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


    const updatedProfessional = await Professional.findById(professional._id).populate("userId", "-password")
.populate({
  path: "reviews",
  options: { sort: { createdAt: -1 }, limit: 10 } // latest reviews
})
.populate({
  path: "gallery",
  options: { sort: { createdAt: -1 }, limit: 20 } // latest gallery
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