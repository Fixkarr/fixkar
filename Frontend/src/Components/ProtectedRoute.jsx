import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FixkarLoader from "../Components/FixkarLoader";

const ProtectedRoute = ({ allowedRole, requireMobileVerified = false, requireOnboarded = false }) => {
  const location = useLocation();

  const { currentUserData, isAuthLoading } = useSelector(
    (state) => state.user
  );

  if (isAuthLoading) {
    return <FixkarLoader />;
  }

  // 1. Login check
  if (!currentUserData) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // 2. Role check
  const role = currentUserData?.user?.userId?.role;

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // 3. Professional onboarding check
  const isOnboarded = currentUserData?.user?.onBoarded;
  const isMobileVerified = currentUserData?.user?.userId?.isMobileVerified;

 if (requireMobileVerified && !isMobileVerified) {
  return <Navigate to="/onboard/verify-mobile" replace />;
}

// 4. Professional onboarding check
if (requireOnboarded && !isOnboarded) {
  return <Navigate to="/onboard" replace />;
}

  return <Outlet />;
};

export default ProtectedRoute;