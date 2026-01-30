import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios'
import { toast } from "react-toastify";
import { server_url } from "../App";
import { useDispatch } from "react-redux";
import { setWalletTransaction } from "../redux/wallet.slice";
const useGetWalletTransaction = (bookingId) => {
  const dispatch = useDispatch();
  const {refresh} = useSelector((state) => state.wallet);

  useEffect(() => {
    const fetchWalletTransaction = async () => {
      try {
        const res = await axios.get(
          `${server_url}/api/booking/get-wallet-transaction/${bookingId}`,
          { withCredentials: true }
        );
        dispatch(setWalletTransaction(res.data.transaction));
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Failed to load wallet");
      }
    };

    fetchWalletTransaction();
  }, [refresh]);

};

export default useGetWalletTransaction;
