import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FixkarLoader from "../Components/FixkarLoader";

const ProtectedRoute = ({ allowedRole }) => {
  const location = useLocation();

  const { currentUserData, isAuthLoading } = useSelector(
    (state) => state.user
  );

  if (isAuthLoading) {
    return <FixkarLoader />;
  }

  if (!currentUserData) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}  
      />
    );
  }

  const role = currentUserData?.user?.userId?.role;

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;