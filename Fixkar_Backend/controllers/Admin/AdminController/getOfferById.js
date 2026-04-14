import { Offer } from "../AdminModels/offer.model.js";

export const getOfferById = async (req,res)=>{
    const {offerId} = req.params;
    try {
        const admin = req.admin;
        if(!admin){
            return res.status(401).json({
                message : "unauthorized!"
            })
        }

        const offer = await Offer.findById(offerId);
        
        if(!offer){
            return res.status(404).json({
                message : "Offer not found!"
            })
        }
        res.status(200).json({
            message : "Offer fetched successfully",
            offer
        })
    } catch (error) {
        console.error("GET OFFER ERROR:", error);
        res.status(500).json({ message: "Failed to fetch offer" });
    }
}