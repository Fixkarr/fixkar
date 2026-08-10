import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  addIncomingRequest,
  addWaitingForCustomerConfirmation,
} from "../redux/pickup.slice";
import { server_url } from "../App";


export const useGetPickupRequests = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPickupRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${server_url}/api/user/professional/pickup-requests`,
        {
          withCredentials: true,
        }
      );
      console.log("🔥 PICKUP API RESPONSE:", response.data);


      const requests =
        response.data?.pickupRequests || [];
        
console.log("🔥 FETCHED PICKUP REQUESTS:", requests);


      requests.forEach((request) => {
        dispatch(
          addIncomingRequest({
            ...request,
            pickupRequestId:
              request.pickupRequestId || request._id,
          })
        );
      });

      const waitingRequests = response.data?.waitingForCustomerConfirmation || [];
      waitingRequests.forEach((request) => {
        dispatch(
          addWaitingForCustomerConfirmation({
            ...request,
            pickupRequestId: request.pickupRequestId || request._id,
            customerConfirmationExpiresAt:
              request.customerConfirmationExpiresAt ||
              request.pickupSessionId?.customerSelectionExpiresAt,
          })
        );
      });

    } catch (error) {
      console.error(
        "Get Pickup Requests Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load pickup requests."
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPickupRequests();
  }, [fetchPickupRequests]);

  return {
    loading,
    error,
    refetch: fetchPickupRequests,
  };
};

