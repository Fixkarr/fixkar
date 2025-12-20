import React, { useEffect } from 'react'
import axios from 'axios'
import {server_url} from '../App'
import { useDispatch } from 'react-redux'
import { setMyBookings } from '../redux/booking.Slice'
import { toast } from 'react-toastify'

const useGetMyBookings = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchMyBookings = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/booking/my-bookings`, {withCredentials : true});
            dispatch(setMyBookings(result?.data.bookings))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    fetchMyBookings()
  },[])
}

export default useGetMyBookings
