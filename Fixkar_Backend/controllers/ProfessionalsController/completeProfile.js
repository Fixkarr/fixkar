import { Skill } from "../../models/skillsModel.js";
import { Professional } from "../../models/userModel.js";
import { Service } from "../../models/serviceModel.js";


export const completeProfile =async (req,res)=>{
    try {
        const {description, skills, taskPricing = [], visitingCharge} = req.body;
       if(!description){
       return res.status(400).json({
            message  : "Description is required"
        })
       }

       const professional = await Professional.findOne({userId : req.userId})

       if(!professional){
        return res.status(404).json({
            message : "Professional not found!"
        })
       }


    let validatedSkills = [];
    let skillDocs = [];

    if (skills && Array.isArray(skills) && skills.length > 0) {
      // ensure selected skills belong to same profession
      skillDocs = await Skill.find({
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

    if (visitingCharge !== undefined && (!Number.isFinite(Number(visitingCharge)) || Number(visitingCharge) < 0)) {
      return res.status(400).json({ message: "Invalid visiting charge" });
    }
    const service = await Service.findById(professional.profession).select("serviceType");
    let validatedTaskPricing = [];
    if (service?.serviceType === "specialized") {
      const rateByTask = new Map(taskPricing.map((rate) => [String(rate.skill), Number(rate.price)]));
      for (const skill of skillDocs) {
        const price = rateByTask.get(String(skill._id));
        if (!Number.isFinite(price) || price < 0) {
          return res.status(400).json({ message: `Set a valid price for ${skill.name}` });
        }
        validatedTaskPricing.push({ skill: skill._id, price });
      }
    }




        await Professional.findByIdAndUpdate(professional._id, {
        description,
        selectedSkills: validatedSkills,
        ...(visitingCharge !== undefined ? { visitingCharge: Number(visitingCharge) } : {}),
        ...(service?.serviceType === "specialized" ? { taskPricing: validatedTaskPricing } : {}),
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
    select : "name image skills serviceType",
    populate : {
      path : "skills",
      select : "name bookingType fixedPrice pricingSource isActive"
    }
  }).populate({
    path : "selectedSkills",
    select : "name bookingType fixedPrice pricingSource isActive"
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
