import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { server_url } from '../App';

const useGetForm = (serviceId) => {
    const [form, setForm] = useState(null);

     useEffect(()=>{
    const fetchForm = async()=>{
      try {
        const result = await axios.get(`${server_url}/api/admin/get-form-by-service/${serviceId}`, {withCredentials : true});
        setForm(result?.data.form)
      } catch (error) {
        console.log(error.response.data.message)
      }
    }
    fetchForm()
  },[])

  return form
}

export default useGetForm
