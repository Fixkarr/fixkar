import {Customer} from '../../../models/userModel.js'

export const getAllCustomers = async (req,res)=>{
    try {
        const customers = await Customer.find().populate({
          path : "userId",
          model : "User",
          select : `+termsAcceptance.accepted
      +termsAcceptance.acceptedAt
      +termsAcceptance.acceptedIP
      +termsAcceptance.policyVersion`
        });
        return res.status(200).json({
            message : "Customers fetched successfully",
            customers
        })
    } catch (error) {
        return res.status(200).json({
            message : "Internal server error!"
        })
    }
}