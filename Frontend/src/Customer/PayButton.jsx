import React from 'react'
import axios from 'axios'
import {server_url} from '../App'
import { toast } from 'react-toastify'
const PayButton = ({bookingId, paymentType, label}) => {
    const handlePayment = async ()=>{
        try {
            const res = await axios.post(`${server_url}/api/booking/create-order`, {bookingId, paymentType});

            const {order, key}  = res.data;

            const options = {
                key,
                amount : order.amount,
                currency : order.currency,
                name : "FixKar",
                description : 
                    paymentType === "FINAL" ?
                    "Service Payment" : "Late Cancelation Charge",
                order_id : order.id,
                handler : function (response){
                    verifyPayment(response)
                },

                modal : {
                    ondismiss : function () {
                        toast.info("Payment cancelled by you!")
                    }
                }
            }

             const rzp = new window.Razorpay(options);
             rzp.open();
            
             const verifyPayment = async (response)=>{
                 try {
            const res = await axios.post(`${server_url}/api/booking/verify-payment`, {
                bookingId,
                paymentType,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            });

            toast.success(res.data.message)
                    

            } catch (err) {
                toast.error(err.response.data.message)
            }
        }



        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }
  return (
     <button className="btn btn-success w-100 mt-3 fw-semibold" onClick={handlePayment}>
      {label || "Pay"}
    </button>
  )
}

export default PayButton
