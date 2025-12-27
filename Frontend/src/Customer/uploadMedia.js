
import axios from 'axios'
import {server_url} from '../App'
import { toast } from 'react-toastify';
export const uploadMedia = async (file)=>{
  
    const formData = new FormData();
    formData.append("media", file); 
    try {
        const res = await axios.post(`${server_url}/api/user/upload-media`, formData, {withCredentials : true, headers : {"Content-Type": "multipart/form-data",}})
        toast.success(res.data.message);
        return res.data
    } catch (error) {
        console.log(error.message);
    }
}