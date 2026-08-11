import { useCallback, useState } from "react";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const useGetAllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = useCallback(async ({
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
            search: search.trim(),
          },
          withCredentials: true,
        },
      );

      setCustomers(result.data?.customers || []);

      setPagination(
        result.data?.pagination || {
          ...DEFAULT_PAGINATION,
          page,
          limit,
        },
      );

      return result.data;
    } catch (error) {
      console.error("Error fetching customers:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to fetch customers. Please try again.",
      );

      setCustomers([]);
      setPagination({
        ...DEFAULT_PAGINATION,
        page,
        limit,
      });

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    customers,
    pagination,
    loading,
    fetchCustomers,
  };
};

export default useGetAllCustomers;
