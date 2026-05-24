import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { getSiteHealth } from '../../../Fixkar_Backend/controllers/Admin/AdminController/getSiteHealth'
import axios from 'axios'
import { server_url } from '../App'
const useGetSiteHealth = () => {
 const [health, setHealth] = useState({})

 useEffect(()=>{
    getSiteHealth();
 },[])

 const getSiteHealth = async ()=>{
    try {
        const res = await axios.get(`${server_url}/api/admin/get-site-health`, {withCredentials : true})
        setHealth(res?.data?.health);
    } catch (error) {
        
    }
 }

 return health;
}

export default useGetSiteHealth
