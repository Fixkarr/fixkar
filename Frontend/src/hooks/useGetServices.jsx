import axios from 'axios'
import React, { useEffect } from 'react'
import { server_url } from '../App'
import { useDispatch } from 'react-redux'
import { setServices } from '../redux/service.Slice'
import { toast } from 'react-toastify'

const useGetServices = () => {
    const dispatch = useDispatch()

    useEffect(()=>{
        const fetchServices = async()=>{
            try {
                const result = await axios.get(`${server_url}/api/user/get-services`);
                dispatch(setServices(result.data.services));
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }

        fetchServices()
    },[])
}

export default useGetServices
