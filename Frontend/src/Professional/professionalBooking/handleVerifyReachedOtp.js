import { toast } from "react-toastify";
import { server_url } from "../../App";
import axios from 'axios'

export  const handleVerifyReachedOtp = async (bookingId, otp)=>{
    try {
      const result = await axios.post(`${server_url}/api/booking/verify-reached-otp`, {otp, bookingId}, {withCredentials : true})
      toast.success(result.data.message)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }