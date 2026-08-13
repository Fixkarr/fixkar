import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import FixkarLoader from "./FixkarLoader";

const AdminProtectedRoute = ({ requiredRole }) => {
  const location = useLocation();

  const { currentAdmin, isAdminLoading } = useSelector(
    (state) => state.admin
  );

  if (isAdminLoading) {
    return <FixkarLoader />;
  }

  if (!currentAdmin) {
    return (
      <Navigate
        to={`${import.meta.env.VITE_ADMIN_PATH}/login`}
        replace
        state={{ from: location }}
      />
    );
  }

  if (requiredRole && currentAdmin.role !== requiredRole) {
    return (
      <Navigate
        to={`${import.meta.env.VITE_ADMIN_PATH}/home`}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AdminProtectedRoute;