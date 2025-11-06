import React, { useEffect } from 'react'
import { setVerifiedProfessionals } from '../redux/professional.slice'
import { useDispatch } from 'react-redux'
import { server_url } from '../App'
import axios from 'axios'

const useGetVerifiedProfessionals = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
          const fetchUser = async () =>{
           try {
             const result = await axios.get(`${server_url}/api/user/verifiedProfessionals`, {withCredentials : true})
            dispatch(setVerifiedProfessionals(result.data));
           } catch (error) {
                console.log("Internal server error!")
           }
        }
        fetchUser()
    },[])
}

export default useGetVerifiedProfessionals
