import { toast } from "react-toastify";
import { server_url } from "../../App";
import axios from 'axios'

export const startJourneyAPI = async (bookingId) => {
    try {
      const result = await axios.post(`${server_url}/api/booking/start-journey`, {bookingId}, {withCredentials : true});
      return result;
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message)
    }
  }