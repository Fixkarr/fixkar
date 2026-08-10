import React, { useState } from 'react'
import axios from 'axios'
import {server_url} from '../App'
import { toast } from 'react-toastify'
const PayButton = ({bookingId, paymentType, label, disabled = false, onSuccess}) => {
    const [loading, setLoading] = useState(false);
    const handlePayment = async ()=>{
        if (disabled || loading) return;
        try {
            setLoading(true);
            const res = await axios.post(`${server_url}/api/booking/create-order`, {bookingId, paymentType}, { withCredentials: true });

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
                        setLoading(false);
                    }
                }
            }

             if (!window.Razorpay) {
               toast.error("Payment service is not ready. Please try again.");
               setLoading(false);
               return;
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
            }, { withCredentials: true });
            toast.success(res.data.message);
            onSuccess?.(res.data);
            } catch (err) {
                toast.error(err.response?.data?.message || "Payment verification failed.")
            } finally {
                setLoading(false);
            }
        }



        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Unable to start payment.")
            setLoading(false);
        }
    }
  return (
     <button className="btn btn-success w-100 mt-3 fw-semibold" disabled={disabled || loading} onClick={handlePayment}>
      {loading ? "Preparing payment..." : (label || "Pay")}
    </button>
  )
}

export default PayButton
