import axios from "axios";
import { server_url } from "../App";

export const getAllProfessionals = async ()=>{
    try {
        return await axios.get(`${server_url}/api/user/professionals`, {withCredentials : true})
    } catch (error) {
        console.log("error in getAllProfessionals", error);
    }
}