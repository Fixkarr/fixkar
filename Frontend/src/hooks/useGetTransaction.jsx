import axios from "axios";
import { useEffect, useState } from "react";
import { server_url } from "../App";
import { toast } from "react-toastify";

const useGetTransaction = (proId, limit) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!proId) return;

    const getTransactions = async () => {
      try {
        setLoading(true);

        const params = limit ? { limit } : undefined;
        const { data } = await axios.get(
          `${server_url}/api/user/professional/get-transactions/${proId}`,
          { withCredentials: true, params }
        );

        setTransactions(data.transactions || []);
      } catch (error) {
       
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, [proId, limit]);

  return { transactions, loading };
};

export default useGetTransaction;
