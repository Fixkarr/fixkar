import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { server_url } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAdmin } from "../redux/admin.Slice";

const useGetCurrentAdmin = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUserData = useSelector((state) => state.user.currentUserData);
  const adminpath = import.meta.env.VITE_ADMIN_PATH;

  const isAdminRoute =
    location.pathname === adminpath ||
    location.pathname.startsWith(`${adminpath}/`);

  useEffect(() => {
    let cancelled = false;

    // Admin and customer/professional sessions are intentionally isolated.
    // Never resolve admin state while the user is inside the normal app.
    if (!isAdminRoute || currentUserData) {
      dispatch(setCurrentAdmin(null));
      return () => {
        cancelled = true;
      };
    }

    const fetchAdmin = async () => {
      try {
        const result = await axios.get(
          `${server_url}/api/admin/get-current-admin`,
          { withCredentials: true }
        );

        if (!cancelled) {
          dispatch(setCurrentAdmin(result.data.admin));
        }
      } catch (error) {
        if (!cancelled) {
          // Never keep stale admin state after the admin session is invalid.
          dispatch(setCurrentAdmin(null));
        }
      }
    };

    fetchAdmin();

    return () => {
      cancelled = true;
    };
  }, [dispatch, isAdminRoute, currentUserData]);
};

export default useGetCurrentAdmin;
