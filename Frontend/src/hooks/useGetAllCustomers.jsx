import { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";

const useGetAllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(false);

  const fetchCustomers = async ({
    page = 1,
    limit = 10,
    search = "",
  } = {}) => {
    try {
      setLoading(true);

      const result = await axios.get(
        `${server_url}/api/admin/get-all-customers`,
        {
          params: {
            page,
            limit,
            search,
          },
          withCredentials: true,
        }
      );

      setCustomers(result.data.customers || []);

      setPagination(
        result.data.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );

    } catch (error) {
      console.log("Error fetching customers:", error);

      toast.error(
        error?.response?.data?.message ||
        "Something went wrong!"
      );

      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCustomers({
      page: 1,
      limit: 10,
      search: "",
    });
  }, []);

  return {
    customers,
    pagination,
    loading,
    fetchCustomers,
  };
};

export default useGetAllCustomers;