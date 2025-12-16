import {Professional} from '../../models/userModel.js';

export const getProfessionalInfo = async (req,res)=>{
    try {
        const {id} = req.params;

        if(!id){
            return res.status(400).json({message: "Professional ID not found"});
        }

        const professionalInfo = await Professional.findById(id).populate("userId");
        if(!professionalInfo){
            return res.status(404).json({message: "Professional not found"});
        }
        return res.status(200).json({professionalInfo});

    } catch (error) {
        console.log("Error in getProfessionalInfo ",error.message);
        return res.status(500).json({message: "Server Error"});
    }
}