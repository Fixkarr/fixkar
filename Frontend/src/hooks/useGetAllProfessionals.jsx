import { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../App";
import { toast } from "react-toastify";

const useGetAllProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(false);

  const fetchProfessionals = async ({
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
            search,
            status,
            profession,
            verified,
          },
          withCredentials: true,
        }
      );

      setProfessionals(result.data.professionals || []);

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
      console.log("Error fetching professionals:", error);

      toast.error(
        error?.response?.data?.message ||
        "Something went wrong!"
      );

      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProfessionals({
      page: 1,
      limit: 10,
      search: "",
      status: "",
      profession: "",
      verified: "",
    });
  }, []);

  return {
    professionals,
    pagination,
    loading,
    fetchProfessionals,
  };
};

export default useGetAllProfessionals;