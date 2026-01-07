import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { server_url } from '../App'
import { toast } from 'react-toastify'
const useGetAllCustomers = () => {
    const [customers, setCustomers] = useState([]);
  useEffect(()=>{
    const fetchAllCustomers = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/admin/get-all-customers`, {withCredentials : true})
            setCustomers(result.data.customers)
            
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    fetchAllCustomers()
  },[])

  return customers
}

export default useGetAllCustomers
