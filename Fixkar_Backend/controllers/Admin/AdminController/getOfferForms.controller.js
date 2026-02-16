import { Form } from "../AdminModels/form.model.js"


export const getOfferForm = async (req,res)=>{
    try {
        const offerForms = await Form.find({purpose : "offer"});
        if(!offerForms && offerForms.length == 0){
            return res.status(404).json({
                message : "there is no any offer forms"
            })
        }

        return res.status(200).json({
            message : "Offer Forms!",
            offerForms
        })

    } catch (error) {
        console.log("Error in Get offer forms", error)
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}