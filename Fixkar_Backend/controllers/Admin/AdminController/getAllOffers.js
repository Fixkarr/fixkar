import { Offer } from "../AdminModels/offer.model.js"

export const getAllOffers = async (req, res)=>{
    try {
        const offers = await Offer.find().populate("serviceId", "name");
        if(offers.length === 0){
            return res.status(404).json({message : "No offers found"});
        }
        res.status(200).json({message : "Offers found", offers : offers});
    } catch (error) {
        res.status(500).json({message : "Server error", error : error.message});
    }
}