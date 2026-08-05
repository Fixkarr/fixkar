import {Professional} from '../../models/userModel.js';

export const getProfessionalInfo = async (req,res)=>{
    try {
        const {id} = req.params;

        if(!id){
            return res.status(400).json({message: "Professional ID not found"});
        }

        const professionalInfo = await Professional.findOne({userId : id}).select('-poi -dob').populate("userId", 'fullName mobile').populate({
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
    select : "name image skills serviceType",
    populate : {
      path : "skills",
      select : "name bookingType fixedPrice pricingSource isActive"
    }
  }).populate({
    path : "selectedSkills",
    select : "name bookingType fixedPrice pricingSource isActive"
  }).populate({ path: 'taskPricing.skill', select: 'name' }).populate('charges');

        if(!professionalInfo){
            return res.status(404).json({message: "Professional not found"});
        }
        return res.status(200).json({professionalInfo});

    } catch (error) {
        return res.status(500).json({message: "Server Error"});
    }
}
