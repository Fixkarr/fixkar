import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { server_url } from '../App';
import { toast } from 'react-toastify';

const useGetTransaction = (proId) => {
    const [transaction, setTransation] = useState([]);
 useEffect(()=>{
    const getTransactions = async ()=>{
        try {
            const result = await axios.get(`${server_url}/api/user/professional/get-transactions/${proId}`);
            setTransation(result.data.transaction);
        } catch (error){
            toast.error(error.response.data.message)
        }
    }

    getTransactions()
 },[])

 return transaction
}

export default useGetTransaction
