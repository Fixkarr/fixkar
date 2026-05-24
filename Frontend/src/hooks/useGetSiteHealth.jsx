import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { server_url } from '../App'
const useGetSiteHealth = () => {
 const [health, setHealth] = useState({})
 const [revenueHealth, setRevenueHealth] = useState({});

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
 const getRevenueHealth = async ()=>{
    try {
        const res = await axios.get(`${server_url}/api/admin/get-revenue-health`, {withCredentials : true})
        setRevenueHealth(res?.data?.revenueHealth);
    } catch (error) {
        
    }
 }

 return {health, revenueHealth};
}

export default useGetSiteHealth
