import axios from 'axios'
import React, { useEffect } from 'react'
import { server_url } from '../App'
import { useDispatch } from 'react-redux'
import { setCurrentUserData } from '../redux/user.slice'
import { toast } from 'react-toastify'

const useGetCurrentUser = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchUser = async () =>{
           try {
             const result = await axios.get(`${server_url}/api/user/current`, {withCredentials : true})
             console.log(result.data)
            dispatch(setCurrentUserData(result.data)); 
           } catch (error) {
                console.log("Internal server error!")
           }
        }
        fetchUser()
    },[])
}

export default useGetCurrentUser
