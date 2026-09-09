import React, { useEffect } from 'react'
import { server_url } from '../App';
import axios from 'axios';

const useGetServiceRequests = (professionalId) => {
    const [serviceRequest, setServiceRequest] = useState(null);

        useEffect(()=>{
             const getServiceRequest = async ()=>{
        try {
          const response = await axios.get(`${server_url}/api/user/get-service-request`,  {
            params: { professionalId },
            withCredentials: true
          });

          setServiceRequest(response?.data?.serviceRequest);
        } catch (error) {
          
        }
      }
      getServiceRequest();
        },[])

        return serviceRequest;
}

export default useGetServiceRequests
