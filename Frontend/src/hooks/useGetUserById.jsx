import axios from 'axios'
import React, { useEffect } from 'react'
import { server_url } from '../App'
import { useDispatch } from 'react-redux'
import { setSelectedUser } from '../redux/chat.slice'

const useGetUserById = (userId) => {
    const dispatch = useDispatch();
    useEffect(()=>{
       const getUserById = async ()=>{
            try {
                const result = await axios.get(`${server_url}/api/user/getUserById/${userId}`);
                dispatch(setSelectedUser(result?.data?.user))
            } catch (error) {
                console.log(error.message);
            }
       }

       getUserById()
    },[])
}

export default useGetUserById
