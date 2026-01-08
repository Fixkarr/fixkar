import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { server_url } from '../App'
import { useState } from 'react'
const useGetReachedOtp = (bookingId) => {
    const [otp, setOtp] = useState('');
 useEffect(()=>{
    const fetchOTP = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/booking/get-reached-otp/${bookingId}`, {withCredentials : true})
            setOtp(result.data.otp);
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    fetchOTP()
 },{})

 return otp;
}

export default useGetReachedOtp
