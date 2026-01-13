import axios from 'axios'
import React, { useEffect } from 'react'
import { server_url } from '../App'
import { useDispatch } from 'react-redux'
import { setCurrentAdmin } from '../redux/admin.Slice'
const useGetCurrentAdmin = () => {
  const dispatch = useDispatch();

  useEffect(()=>{
     const fetchAdmin = async ()=>{
           try {
             const result = await axios.get(`${server_url}/api/admin/get-current-admin`, {withCredentials : true});
              dispatch(setCurrentAdmin(result.data.admin));
           } catch (error) {

           }
        }
    fetchAdmin()
  },[])
}

export default useGetCurrentAdmin
