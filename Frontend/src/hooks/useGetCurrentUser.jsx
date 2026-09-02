import axios from 'axios'
import React, { useEffect } from 'react'
import { server_url } from '../App'
import { useDispatch } from 'react-redux'
import { setAuthLoading, setCurrentUserData } from '../redux/user.slice'
import { toast } from 'react-toastify'
import { setSelectedLocation } from '../redux/location.slice'

const useGetCurrentUser = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchUser = async () =>{
           try {
            dispatch(setAuthLoading(true))
             const result = await axios.get(`${server_url}/api/user/current`, {withCredentials : true})
            dispatch(setCurrentUserData(result.data));
            if (result.data?.selectedLocation) {
                dispatch(setSelectedLocation(result.data.selectedLocation));
                }
           } catch (error) {
               dispatch(setCurrentUserData(null))
           }
        }
        fetchUser()
    },[])
}

export default useGetCurrentUser
