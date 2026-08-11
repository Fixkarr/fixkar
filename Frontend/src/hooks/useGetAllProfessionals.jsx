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

const useGetAllProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(false);

  const fetchProfessionals = useCallback(async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    profession = "",
    verified = "",
  } = {}) => {
    try {
      setLoading(true);

      const result = await axios.get(
        `${server_url}/api/admin/get-all-professionals`,
        {
          params: {
            page,
            limit,
            search: search.trim(),
            status,
            profession,
            verified,
          },
          withCredentials: true,
        },
      );

      setProfessionals(result.data?.professionals || []);

      setPagination(
        result.data?.pagination || {
          ...DEFAULT_PAGINATION,
          page,
          limit,
        },
      );

      return result.data;
    } catch (error) {
      console.error("Error fetching professionals:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to fetch professionals. Please try again.",
      );

      setProfessionals([]);
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
    professionals,
    pagination,
    loading,
    fetchProfessionals,
  };
};

export default useGetAllProfessionals;
