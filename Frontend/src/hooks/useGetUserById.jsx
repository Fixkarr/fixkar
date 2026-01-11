import axios from 'axios'
import React, { useEffect } from 'react'
import { server_url } from '../App'
import { useDispatch } from 'react-redux'

import { setSelectedConversation } from '../redux/chatMessages.slice'

const useGetUserById = (userId) => {
    const dispatch = useDispatch();
    useEffect(()=>{
       const getUserById = async ()=>{
            try {
                const result = await axios.get(`${server_url}/api/user/getUserById/${userId}`);
                dispatch(setSelectedConversation({
                    userId,
                    user : result.data.user
                }))
            } catch (error) {
                console.log(error.message);
            }
       }

       getUserById()
    },[userId, dispatch])
}

export default useGetUserById
