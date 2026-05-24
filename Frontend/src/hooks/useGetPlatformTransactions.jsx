import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { server_url } from '../App';
import { useState } from 'react';

const useGetPlatformTransactions = () => {  
    const [platformTransaction, setPlatformTransaction] = useState([]);

    useEffect(()=>{
        const getPlatformTransaction = async ()=>{
            try {
                const response = await axios.get(`${server_url}/api/admin/get-platform-transactions`, {withCredentials : true})
                setPlatformTransaction(response?.data?.platformTransactions)
            } catch (error) {
                
            }
        }

        getPlatformTransaction()
    })

    return platformTransaction;
}

export default useGetPlatformTransactions
