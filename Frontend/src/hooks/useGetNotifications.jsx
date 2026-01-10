import axios from 'axios'
import React, { useEffect } from 'react'
import { server_url } from '../App'
import { useDispatch } from 'react-redux'
import { setNotifications } from '../redux/notification.slice'

const useGetNotifications = () => {
    const dispatch = useDispatch()
    
    useEffect(()=>{
        const fetchNotifications = async ()=>{
            try {
                const result = await axios.get(`${server_url}/api/notification/get-my-notifications`, {withCredentials  :true})

                dispatch(setNotifications({  notifications: res.data.notifications,
                                            unreadCount: res.data.unreadCount}))
            } catch (error) {
                     console.log("Notification fetch error", error.message);
            }
        }

        fetchNotifications()
    },[dispatch])
}

export default useGetNotifications
