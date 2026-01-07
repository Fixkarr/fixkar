import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { server_url } from '../App'
import { toast } from 'react-toastify'
const useGetAllProfessionals = () => {
    const [professionals, setProfessionals] = useState([]);
  useEffect(()=>{
    const fetchAllProfessionals = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/admin/get-all-professionals`, {withCredentials : true})
           setProfessionals(result.data.users || [])
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    fetchAllProfessionals()
  },[])

  return professionals
}

export default useGetAllProfessionals
