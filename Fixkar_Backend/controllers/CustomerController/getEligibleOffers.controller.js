import {Booking} from '../../models/bookingModel.js'

export const getEligibleOffers = async(req,res)=>{
    try {
        const {bookingId} = req.body;
        if(!bookingId){
            return res.status(400).json({
                message : "Booking Id not found!"
            })
        }

        const booking = await Booking.findById(bookingId);
        if(!booking){
            return res.status(400).json({
                message : "Booking not found!"
            })
        }

        


    } catch (error) {
        
    }
}