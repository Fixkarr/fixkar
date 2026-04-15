import {Offer} from "../../Admin/AdminModels/offer.model.js";

export const removeOffer = async (req,res)=>{
    try {
        const admin = req.admin;
        if(!admin) return res.status(401).json({message : "Unauthorized!"})
            const {offerId} = req.params;
         if(!offerId){
            return res.status(400).json({
                message : "Offer ID is required!"
            })
         }

         const offer = await Offer.findByIdAndDelete(offerId);
         if(!offer){
            return res.status(404).json({
                message : "Offer not found!"
            })
         }

         return res.status(200).json({
            message : "Offer removed successfully!"
         })
    } catch (error) {
        return res.status(500).json({
            message : "Internal server error!"
        })
    }
}