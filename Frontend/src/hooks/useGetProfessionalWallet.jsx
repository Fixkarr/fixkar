import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios'
import { toast } from "react-toastify";
import { server_url } from "../App";
import { useDispatch } from "react-redux";
import { setWallet } from "../redux/wallet.slice";

const useGetProfessionalWallet = () => {
  const dispatch = useDispatch();

  const {refresh} = useSelector((state) => state.wallet);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get(
          `${server_url}/api/booking/get-professional-wallet`,
          { withCredentials: true }
        );        
        dispatch(setWallet(res.data))
      } catch (error) {
      
      }
    };

    fetchWallet();
  }, [refresh]);
};

export default useGetProfessionalWallet;
