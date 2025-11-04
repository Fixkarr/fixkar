import axios from 'axios'
import React, { useEffect } from 'react'
import { server_url } from '../App'
import { useDispatch } from 'react-redux'
import { setCurrentUserData } from '../redux/user.slice'

const useGetCurrentUser = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchUser = async () =>{
           try {
             const result = await axios.get(`${server_url}/api/user/current`, {withCredentials : true})
            dispatch(setCurrentUserData(result.data)); 
           } catch (error) {
                console.log(error)
           }
        }

        fetchUser()
    },[])
}

export default useGetCurrentUser
