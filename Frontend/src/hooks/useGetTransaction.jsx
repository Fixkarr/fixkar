import axios from "axios";
import { useEffect, useState } from "react";
import { server_url } from "../App";
import { toast } from "react-toastify";

const useGetTransaction = (proId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!proId) return;

    const getTransactions = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${server_url}/api/user/professional/get-transactions/${proId}`,
          { withCredentials: true }
        );

        setTransactions(data.transactions || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch transactions"
        );
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, [proId]);

  return { transactions, loading };
};

export default useGetTransaction;
