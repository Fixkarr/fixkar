import { Professional } from "../../models/userModel.js";

export const setBusyDays = async (req,res)=>{
    try {
        const {busyDays} = req.body;
               if(!busyDays || busyDays.length === 0){
            return res.status(400).json({
                message : "Please select days first!"
            });
        }

         const formattedDays = busyDays.map(d => new Date(d).toISOString().split("T")[0]);

        const professional = await Professional.findOne({userId : req.userId});



        if(!professional){
            return res.status(404).json({
                message : "Professional not found"
            })
        }

        const updatedProfessional = await Professional.findByIdAndUpdate(professional._id,
            {
                $addToSet: { busyDays: { $each: formattedDays } } // <-- MAGIC
            },{new : true}
        ).populate("userId")

        return res.status(200).json({
            message : "Dates updated!",
            user : updatedProfessional
        })
    } catch (error) {
        console.log("error in setBusyDays", error)
        return res.status(500).json({
            message : "internal server error"
        })
    }
}