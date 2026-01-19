import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { server_url } from '../App'
import { toast } from 'react-toastify'
const useGetAllBookings = () => {
    const [bookings, setBookings] = useState([]);
  useEffect(()=>{
    const fetchAllBookings = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/admin/get-all-bookings`, {withCredentials : true})
           setBookings(result.data.bookings || [])
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    fetchAllBookings()
  },[])

  return bookings
}

export default useGetAllBookings
