import { toast } from "react-toastify";
import { server_url } from "../../App";
import axios from 'axios'

export  const handleAcceptBooking = async (bookingId)=>{
    try {
      const result = await axios.post(`${server_url}/api/booking/accept-booking`, {bookingId}, {withCredentials : true})
      toast.success(result.data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message)
    }
  }