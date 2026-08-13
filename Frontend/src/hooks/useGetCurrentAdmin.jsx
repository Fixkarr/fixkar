import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { server_url } from "../App";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAdmin,
  setAdminLoading,
} from "../redux/admin.Slice";

const useGetCurrentAdmin = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const currentUserData = useSelector(
    (state) => state.user.currentUserData
  );

  const adminpath = import.meta.env.VITE_ADMIN_PATH;

  const isAdminRoute =
    location.pathname === adminpath ||
    location.pathname.startsWith(`${adminpath}/`);

  useEffect(() => {
    let cancelled = false;

    // Normal customer/professional area
    if (!isAdminRoute) {
      dispatch(setCurrentAdmin(null));
      dispatch(setAdminLoading(false));

      return () => {
        cancelled = true;
      };
    }

    // User session exists → never treat it as admin
    if (currentUserData) {
      dispatch(setCurrentAdmin(null));
      dispatch(setAdminLoading(false));

      return () => {
        cancelled = true;
      };
    }

    const fetchAdmin = async () => {
      dispatch(setAdminLoading(true));

      try {
        const result = await axios.get(
          `${server_url}/api/admin/get-current-admin`,
          {
            withCredentials: true,
          }
        );

        if (!cancelled) {
          dispatch(setCurrentAdmin(result.data.admin));
        }
      } catch (error) {
        if (!cancelled) {
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