import { toast } from "react-toastify";
import { server_url } from "../../App";
import axios from 'axios'

export const reachedToLocationAPI = async (bookingId) => {
    try {
      const result = await axios.post(`${server_url}/api/booking/mark-reached`, {bookingId}, {withCredentials : true})
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message)
    }
  }