import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { server_url } from "../App";

const useGetAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 Fetch function (reusable)
  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${server_url}/api/user/get-my-announcements`, {withCredentials : true});

      setAnnouncements(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 Auto fetch on mount
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    loading,
    error,
    refetch: fetchAnnouncements, // 🔥 manual refresh ke liye
  };
};

export default useGetAnnouncements;