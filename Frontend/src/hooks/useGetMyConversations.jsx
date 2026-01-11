import React, { useEffect } from 'react'
import axios from 'axios';
import { server_url } from '../App';
import { useDispatch } from 'react-redux';
import { setConversations } from '../redux/messages.Slice';
const useGetMyConversations = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchMyConversations = async ()=>{
            try {
                const result = await axios.get(`${server_url}/api/messages/get-my-conversations`, {withCredentials : true});
                dispatch(setConversations(result.data.conversations));
            } catch (error) {
                console.log(error)
            }
        }
        fetchMyConversations();
    },{dispatch})
}

export default useGetMyConversations
